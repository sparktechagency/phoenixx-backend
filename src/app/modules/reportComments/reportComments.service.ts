import QueryBuilder from '../../../builder/QueryBuilder';
import { User } from '../user/user.model';
import { emailTemplate } from '../../../shared/emailTemplate';
import { emailHelper } from '../../../helpers/emailHelper';
import mongoose from 'mongoose';
import { Notification } from '../notification/notification.model';
import { IReportComment } from './reportComments.interface';
import { Comment } from '../comments/comment.model';
import { ReportComment } from './reportComments.model';

const createReport = async (payload: IReportComment) => {
      const comment = await Comment.findById(payload.commentId);
      if (!comment) {
            throw new Error('Comment not found');
      }

      const result = await ReportComment.create(payload);
      if (!result) {
            throw new Error('Failed to create report');
      }

      const adminNotification = await Notification.create({
            recipientRole: 'admin',
            title: 'Report Comment',
            commentId: comment._id,
            message: `A user has reported a comment ${comment.content}`,
            type: 'report',
            recipient: payload.reporterId,
      });
      const userNotification = await Notification.create({
            recipientRole: 'user',
            title: 'Report Comment',
            commentId: comment._id,
            message: `Your comment ${comment.content} has been reported`,
            type: 'report',
            recipient: comment.author,
      });
      //@ts-ignore
      const io = global.io;
      if (io) {
            io.emit(`notification::${comment.author.toString()}`, userNotification);
            io.emit(`notification::admin`, adminNotification);
      }

      return result;
};

const getAllReports = async (query: Record<string, any>) => {
      const reportQuery = new QueryBuilder(
            ReportComment.find()
                  .populate({
                        path: 'commentId',
                        select: 'content author',
                        populate: {
                              path: 'author',
                              select: 'userName name email',
                        },
                  })
                  .populate({
                        path: 'reporterId',
                        select: 'userName name email',
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
      const report = await ReportComment.findById(reportId);
      if (!report) {
            throw new Error('Report not found');
      }

      const comment = await Comment.findById(report.commentId);
      if (!comment) {
            throw new Error('Comment not found');
      }

      const author = await User.findById(comment.author);
      if (!author) {
            throw new Error('Author not found');
      }

      const result = await ReportComment.findByIdAndUpdate(reportId, {
            status: 'reviewed',
            new: true,
            runValidators: true,
      });
      const reportData = {
            authorName: author.userName,
            authorEmail: author.email,
            commentContent: comment.content,
            message: message,
      };
      const notification = await Notification.create({
            recipientRole: 'user',
            title: 'Comment Warning',
            message: `Your comment ${comment.content} has been reported`,
            type: 'warning',
            recipient: comment.author,
      });
      //@ts-ignore
      const io = global.io;
      if (io) {
            io.emit(`notification::${comment.author.toString()}`, notification);
      }
      const resentOtpTemplate = emailTemplate.reportCommentWarning(reportData);
      emailHelper.sendEmail(resentOtpTemplate);

      const reportEmailTemplate = emailTemplate.reportCommentWarning(reportData);
      await emailHelper.sendEmail(reportEmailTemplate);
      return result;
};

const deleteReportedPost = async (reportId: string) => {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
            const isExist = await ReportComment.findById(reportId).session(session);
            if (!isExist) {
                  throw new Error('Report not found');
            }

            await Comment.findByIdAndUpdate(isExist.commentId, { status: 'deleted' }, { session });

            await ReportComment.deleteOne({ _id: isExist._id }, { session });
            await ReportComment.findByIdAndUpdate(
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

export const ReportCommentsService = {
      createReport,
      getAllReports,
      deleteReportedPost,
      giveWarningReportedPostAuthorToDB,
};
