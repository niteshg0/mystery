import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your Email",
        },
        password: { label: "Password", type: "password" },
      },

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      async authorize(
        credentials: Record<string, string> | undefined
      ): Promise<any> {
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        await dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("User not found with this Email");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your Account");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect Password");
          } else {
            return user;
          }
        } catch (error: unknown) {
          throw new Error(
            error instanceof Error ? error.message : "An error occurred"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerfied = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessage = token.isAcceptingMessage;
        session.user.username = token.username;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  secret: "@ndup@ndu",
  pages: {
    signIn: "/sign-in",
  },
};
