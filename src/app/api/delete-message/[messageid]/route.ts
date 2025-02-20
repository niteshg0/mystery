import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/option";
import { getServerSession, User } from "next-auth";
import { setEngine } from "crypto";
import userModel from "@/model/User";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {messageid: string}}){

    const messageId= params.messageid

    await dbConnect();

    const session= await getServerSession(authOptions);

    // const userId= new mongoose.Types.ObjectId(session?.user._id)

    const _user: User = session?.user as User;

    if(!session || !session?.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401}) 
    }

    try {
        const response= await userModel.updateOne(
            {_id: _user._id},
            {$pull: {messages: {_id : messageId}}}
        )

        if(response.modifiedCount===0){
            return Response.json({
                success: false,
                message: "Message not found"
            }, {status: 401}) 
        }

        return Response.json({
            success: true,
            message: "Message Deleted"
        }, {status: 200})

    } catch (error) {
        console.error('An unexpected error occurred:', error);
        
        return Response.json(
            { message: 'error deleting message', success: false },
            { status: 500 }
        );
    }

}