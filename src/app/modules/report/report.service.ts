import { Report } from './report.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IReport } from './report.interface';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';
import mongoose from 'mongoose';
import { Notification } from '../notification/notification.model';

const createReport = async (payload: IReport) => {
      const post = await Post.findById(payload.postId);
      if (!post) {
            throw new Error('Post not found');
      }

      const result = await Report.create(payload);
      if (!result) {
            throw new Error('Failed to create report');
      }

      const adminNotification = await Notification.create({
            recipientRole: 'admin',
            itle: "Report Post",
            message: `A user has reported a post ${post.title}`,
            type: 'info',
            recipient: payload.reporterId,
      });
      const userNotification = await Notification.create({
            recipientRole: 'user',
            title: "Report Post",
            message: `Your post ${post.title} has been reported`,
            type: 'info',
            recipient: post.author,
      });
      //@ts-ignore
      const io = global.io;
      if (io) {
            io.emit(`notification::${post.author.toString()}`, userNotification);
            io.emit(`notification::admin`, adminNotification);
      }

      return result;
};

const getAllReports = async (query: Record<string, any>) => {
      const reportQuery = new QueryBuilder(
            Report.find()
                  .populate({
                        path: 'postId',
                        select: 'title images author',
                        populate: {
                              path: 'author',
                              select: 'userName email',
                        },
                  })
                  .populate({
                        path: 'reporterId',
                        select: 'userName email',
                  }),
            query
      )
            .search(['reason', 'description'])

            .filter()
            .sort()
            .paginate();

      const result = await reportQuery.modelQuery;
      const meta = await reportQuery.countTotal();

      return {
            meta,
            result,
      };
};

const giveWarningReportedPostAuthorToDB = async (reportId: string, message: string) => {
      const report = await Report.findById(reportId);
      if (!report) {
            throw new Error('Report not found');
      }

      const post = await Post.findById(report.postId);
      if (!post) {
            throw new Error('Post not found');
      }

      const author = await User.findById(post.author);
      if (!author) {
            throw new Error('Author not found');
      }

      const result = await Report.findByIdAndUpdate(reportId, {
            status: 'reviewed',
            new: true,
            runValidators: true,
      });
      const reportData = {
            authorName: author.userName,
            authorEmail: author.email,
            postTitle: post.title,
            message: message,
      };
      const notification = await Notification.create({
            recipientRole: 'user',
            title: "Post Warning",
            message: `Your post ${post.title} has been reported`,
            type: 'info',
            recipient: post.author,
      });
      //@ts-ignore
      const io = global.io;
      if (io) {
            io.emit(`notification::${post.author.toString()}`, notification);
      }
      const resentOtpTemplate = emailTemplate.reportWarning(reportData);
      emailHelper.sendEmail(resentOtpTemplate);


      const reportEmailTemplate = emailTemplate.reportWarning(reportData);
      await emailHelper.sendEmail(reportEmailTemplate);
      return result;
};

const deleteReportedPost = async (reportId: string) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
            const isExist = await Report.findById(reportId).session(session);
            if (!isExist) {
                  throw new Error('Report not found');
            }

            await Post.findByIdAndUpdate(isExist.postId, { status: 'deleted' }, { session });

            await Report.deleteOne({ _id: isExist._id }, { session });
            await Report.findByIdAndUpdate(
                  isExist._id,
                  {
                        status: 'resolved',
                  },
                  { session, runValidators: true, new: true }
            );

            await session.commitTransaction();
      } catch (error) {
            await session.abortTransaction();
            throw error;
      } finally {
            session.endSession();
      }
};

export const ReportService = {
      createReport,
      getAllReports,
      deleteReportedPost,
      giveWarningReportedPostAuthorToDB,
};
