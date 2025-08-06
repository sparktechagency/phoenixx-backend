import { ICreateAccount, IReportWarning, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
    const data = {
        to: values.email,
        subject: 'Verify your account',
        html: `<body style="font-family: 'Arial', sans-serif; background-color: #f7f9fc; margin: 0; padding: 0; color: #333;">
      <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px;" />
        
        <h2 style="color: #0000FB; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center;">Hello, ${values.name}!</h2>
        
        <p style="color: #555; font-size: 18px; line-height: 1.6; margin-bottom: 30px; text-align: center;">To complete your registration, please use the verification code below:</p>
        
        <div style="text-align: center;">
          <div style="background-color: #0000FB; width: 130px; padding: 18px; text-align: center; border-radius: 8px; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 20px auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            ${values.otp}
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">This code is valid for the next 3 minutes.</p>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 40px;">If you did not request this, please ignore this email.</p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://mehor.com" style="background-color: #0000FB; color: #fff; padding: 14px 22px; border-radius: 30px; font-size: 16px; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s ease;">
            Go to Your Account
          </a>
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
        html: `<body style="font-family: 'Arial', sans-serif; background-color: #f7f9fc; margin: 0; padding: 0; color: #333;">
      <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px;" />
        
        <h2 style="color: #0000FB; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center;">Hey, ${values.email}!</h2>
        
        <p style="color: #555; font-size: 18px; line-height: 1.6; margin-bottom: 30px; text-align: center;">Your single-use code for verifying your Mehor account is:</p>
        
        <div style="text-align: center;">
          <div style="background-color: #0000FB; width: 120px; padding: 20px; text-align: center; border-radius: 8px; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 20px auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            ${values.otp}
          </div>
          <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">This code is valid for the next 3 minutes.</p>
        </div>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 40px;">If you did not request this, please ignore this email.</p>
        
        <div style="text-align: center; margin-top: 20px;">
          <a href="https://mehor.com" style="background-color: #0000FB; color: #fff; padding: 14px 22px; border-radius: 30px; font-size: 16px; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s ease;">
            Go to Your Account
          </a>
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
        html: `<body style="font-family: 'Arial', sans-serif; background-color: #f7f9fc; margin: 0; padding: 0; color: #333;">
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px;" />
          
          <h2 style="color: #d32f2f; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center;">Important Notice Regarding Your Post</h2>
          
          <div style="padding: 20px;">
            <p style="color: #555; font-size: 18px; line-height: 1.6; margin-bottom: 20px;">Dear ${values.authorName},</p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              We hope this email finds you well. We are writing to inform you that your post titled "<strong>${values.postTitle}</strong>" has been reported for the following reason:
            </p>
            
            <div style="background-color: #f8f8f8; padding: 15px; border-left: 4px solid #d32f2f; margin: 20px 0;">
              <p style="color: #555; font-size: 16px; margin: 0;">${values.message}</p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              As a valued member of our community, we kindly remind you to review our <a href="#" style="color: #d32f2f; text-decoration: none; font-weight: bold;">community guidelines</a>. This warning serves as a notification that your post may not align with these guidelines.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Please note that repeated violations may result in further action, including potential post removal or account restrictions.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              If you believe this warning was issued in error, please contact our <a href="#" style="color: #d32f2f; text-decoration: none; font-weight: bold;">support team</a>.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Best regards,<br>The Community Team
            </p>
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
        html: `<body style="font-family: 'Arial', sans-serif; background-color: #f7f9fc; margin: 0; padding: 0; color: #333;">
        <div style="max-width: 600px; margin: 50px auto; background-color: #ffffff; padding: 30px; border-radius: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <img src="https://res.cloudinary.com/ddhhyc6mr/image/upload/v1745838639/hbtbqyhmubqaeeft5k85.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px;" />
          
          <h2 style="color: #0000FB; font-size: 28px; font-weight: 700; margin-bottom: 20px; text-align: center;">Hello, ${values.email}!</h2>
          
          <p style="color: #555; font-size: 18px; line-height: 1.6; margin-bottom: 30px; text-align: center;">To reset your password, use the following single-use code:</p>
          
          <div style="text-align: center;">
            <div style="background-color: #0000FB; width: 125px; padding: 20px; text-align: center; border-radius: 8px; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 20px auto; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              ${values.otp}
            </div>
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">This code is valid for the next 3 minutes.</p>
          </div>
          
          <p style="color: #555; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 40px;">If you did not request this, please ignore this email.</p>
          
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://mehor.com" style="background-color: #0000FB; color: #fff; padding: 14px 22px; border-radius: 30px; font-size: 16px; text-decoration: none; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s ease;">
              Reset Your Password
            </a>
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
