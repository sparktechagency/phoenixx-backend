import { ICreateAccount, IReportWarning, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
      const data = {
            to: values.email,
            subject: 'Verify your account',
            html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #0000FB; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Mehor Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #0000FB; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
      };
      return data;
};
const resetOtp = (values: IResetPassword) => {
      const data = {
            to: values.email,
            subject: 'Here is your email resend otp',
            html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #0000FB; font-size: 24px; margin-bottom: 20px;">Hey! ${values.email}, Your Mehor Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #0000FB; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
      };
      return data;
};

const reportWarning = (values: IReportWarning) => {
      const data = {
            to: values.authorEmail,
            subject: 'Community Guidelines Warning: Action Required',
            html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <h2 style="color: #d32f2f; font-size: 24px; margin-bottom: 20px;">Important Notice Regarding Your Post</h2>
        <div style="padding: 20px;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Dear ${values.authorName},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We hope this email finds you well. We are writing to inform you that your post titled "${values.postTitle}" has been reported for the following reason:</p>
            <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
                <p style="color: #555; font-size: 16px; margin: 0;">${values.message}</p>
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">As a valued member of our community, we kindly remind you to review our community guidelines. This warning serves as a notification that your post may not align with these guidelines.</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Please note that repeated violations may result in further action, including potential post removal or account restrictions.</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">If you believe this warning was issued in error, please contact our support team.</p>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">Best regards,<br>The Community Team</p>
        </div>
    </div>
</body>`,
      };
      return data;
};

const resetPassword = (values: IResetPassword) => {
      const data = {
            to: values.email,
            subject: 'Reset your password',
            html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #0000FB; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
      };
      return data;
};

export const emailTemplate = {
      createAccount,
      resetPassword,
      resetOtp,
      reportWarning,
};
