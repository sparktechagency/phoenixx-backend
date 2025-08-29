import { Schema, model } from "mongoose";
import { IReportComment } from "./reportComments.interface";


const reportSchema = new Schema<IReportComment>(
      {
            commentId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Comment',
                  required: true,
            },
            postId: {
                  type: Schema.Types.ObjectId,
                  ref: 'Post',
                  required: true,
            },
            reporterId: {
                  type: Schema.Types.ObjectId,
                  ref: 'User',
                  required: true,
            },

            reason: {
                  type: String,
                  required: true,
            },
            description: {
                  type: String,
            },
            status: {
                  type: String,
                  enum: ['pending', 'reviewed', 'resolved'],
                  default: 'pending',
            },
      },
      {
            timestamps: true,
      }
);

export const ReportComment = model<IReportComment>('ReportComment', reportSchema);
