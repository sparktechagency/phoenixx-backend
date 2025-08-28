export type ICreateAccount = {
      name: string;
      email: string;
      otp: number;
};

export type IResetOtp = {
      name: string;
      email: string;
      otp: number;
};
export type IResetPassword = {
      email: string;
      otp: number;
};

export type IReportWarning = {
      authorName: string;
      authorEmail: string;
      postTitle: string;
      message: string;
};
export type IReportCommentWarning = {
      authorName: string;
      authorEmail: string;
      commentContent: string;
      message: string;
};
