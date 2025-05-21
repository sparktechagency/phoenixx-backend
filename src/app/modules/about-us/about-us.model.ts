import { model, Schema } from "mongoose";
import { IAboutUs } from "./about-us.interface";

const AboutUsSchema = new Schema<IAboutUs>(
  {
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const AboutUs = model<IAboutUs>("AboutUs", AboutUsSchema);
