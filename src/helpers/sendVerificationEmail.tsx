import {resend} from "../lib/Resend"
import VerificationEmail from "../../emails/Verification"
import { ApiResponse } from "@/types/ApiResponse"


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string,
): Promise<ApiResponse>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: "Verification Code",
            react: VerificationEmail({ username, otp: verifyCode }),
          });

        return {
            success: true,
            message: "Verification email send Successfullly"
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verification email"
        }
    }
}