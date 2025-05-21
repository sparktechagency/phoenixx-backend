export type ICreateAccount = {
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
