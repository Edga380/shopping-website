"use server";

import { hash } from "bcrypt";
import newClient from "../../utils/newClient";
import { UserData } from "../../../types/databaseTypes";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export default async function recoverPassword(formData: FormData) {
  const database = newClient();

  const email = formData.get("email") as string;

  try {
    const result = database
      .prepare(
        `
            SELECT email
            FROM Users
            WHERE email = ?
            `
      )
      .get(email) as UserData;

    if (!result.email) {
      return {
        success: false,
        data: null,
        message: "Email address does not exist.",
        color: "red",
      };
    }

    const resetToken = await hash(result.email, 10);
    const resetURL = `http://localhost:3000/profile/resetPassword?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 10);

    database
      .prepare(
        `
        UPDATE Users
        SET resetPasswordToken = ?, resetPasswordExpires = ?
        WHERE email = ?
        `
      )
      .run(resetToken, expiration.toString(), result.email);

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: `smtp.gmail.com`,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: `Password Reset Request`,
      html: `<p>You are receiving this email because you requested to reset your password.</p><tr>
                <p>Please click the following link to reset your password:
                <a href="${resetURL}">link</a></p><tr>
                
                <p>If you did not request this, please ignore this email.</p>`,
    });

    return { success: true, message: "Recovery email sent.", color: "green" };
  } catch (error) {
    console.error("Error inside recoverPassword.ts: ", error);
    return {
      success: false,
      message: "Email recovery not available.",
      color: "red",
    };
  }
}
