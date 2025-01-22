import {NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github"
import bcrypt from "bcryptjs"
import { JWT } from "next-auth/jwt"
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import {user} from "@/model/User";


export const authOptions: NextAuthOptions= {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            credentials: {
                email : { label: "Email", type: "text", placeholder: "Enter your Email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                const user = await userModel.findOne({
                    $or: [
                        {email: credentials.indentifier},
                        {username: credentials.identifier}
                    ]
                 })

                if(!user){
                    throw new Error("User not found with this Email")
                }

                if(!user.isVerified){
                    throw new Error("Please verify your Account")
                }

                const isPasswordCorrect= await bcrypt.compare(credentials.password, user.password)

                if(!isPasswordCorrect){
                    throw new Error("Incorrect Password")
                }else{
                    return user;
                }

                
            },
        }),
    ],

    callbacks: {
        async jwt({token, user}){
            if(user){
                token._id= user._id?.toString();
                token.isVerfied= user.isVerified;
                token.isAcceptingMessage= user.isAcceptingMessage;
                token.username = user.username;
            }

            return token;
        },

        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }

            return session;
        },

    },

    session : {
        strategy : 'jwt'
    },
    secret: "@ndup@ndu",
    pages: {
        signIn: '/sign-up'
    }
    
}