import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { model, Schema } from 'mongoose';
import config from '../../../config';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser, UserModal } from './user.interface';

const userSchema = new Schema<IUser, UserModal>(
      {
            name: {
                  type: String,
            },
            userName: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
                  trim: true,
                  minlength: 3,
                  maxlength: 30,
            },
            role: {
                  type: String,
                  enum: Object.values(USER_ROLES),
                  required: true,
            },
            email: {
                  type: String,
                  required: true,
                  unique: true,
                  lowercase: true,
            },
            stripeCustomerId: {
                  type: String,
                  default: null,
                  select: 0,
            },
            subscription: {
                  subscriptionPackageId: { type: Schema.Types.ObjectId, ref: 'Subscription' },
                  stripeSubscriptionId: { type: String },
                  status: { type: String, enum: ['active', 'deleted', 'inactive'], default: 'inactive' },
                  priceId: { type: String },
            },
            contact: {
                  type: String,
            },
            password: {
                  type: String,
                  required: true,
                  select: 0,
                  minlength: 8,
            },
            location: {
                  type: String,
            },
            profile: {
                  type: String,
                  default: 'https://i.ibb.co/z5YHLV9/profile.png',
            },
            status: {
                  type: String,
                  enum: ['active', 'delete'],
                  default: 'active',
            },
            verified: {
                  type: Boolean,
                  default: false,
            },
            authentication: {
                  type: {
                        isResetPassword: {
                              type: Boolean,
                              default: false,
                        },
                        oneTimeCode: {
                              type: Number,
                              default: null,
                        },
                        expireAt: {
                              type: Date,
                              default: null,
                        },
                  },
                  select: 0,
            },
      },
      { timestamps: true }
);

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
      const isExist = await User.findById(id);
      return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
      const isExist = await User.findOne({ email });
      return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (password: string, hashPassword: string): Promise<boolean> => {
      return await bcrypt.compare(password, hashPassword);
};

//check user
userSchema.pre('save', async function (next) {
      //check user
      const isExistUser = await User.find({ userName: this.userName });
      if (isExistUser.length > 0) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Username already exist!');
      }
      const isExist = await User.findOne({ email: this.email });
      if (isExist) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Email already exist!');
      }

      //password hash
      this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_rounds));
      next();
});

export const User = model<IUser, UserModal>('User', userSchema);
