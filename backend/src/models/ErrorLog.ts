import mongoose, { Document, Schema } from 'mongoose';

export interface IErrorLog extends Document {
  message: string;
  stack?: string;
  statusCode: number;
  method: string;
  url: string;
  userId?: mongoose.Types.ObjectId;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const errorLogSchema = new Schema<IErrorLog>(
  {
    message: {
      type: String,
      required: true
    },
    stack: {
      type: String
    },
    statusCode: {
      type: Number,
      required: true
    },
    method: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ip: {
      type: String
    },
    userAgent: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries and automatic cleanup
errorLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days

export const ErrorLog = mongoose.model<IErrorLog>('ErrorLog', errorLogSchema);