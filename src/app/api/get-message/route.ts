import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";
import userModel from "@/model/User";



export async function GET(request: Request){

    await dbConnect();

    const session= await getServerSession(authOptions);

    const _user= session?.user;
    //_user is String we have converted into string in token in authOptions

    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, {status: 401})
    }

    // const userId= _user._id
    // here userId will be string

    const userId= new mongoose.Types.ObjectId(_user._id);
    //convert to original ID

    try {
        const user= await userModel.aggregate([
            {$match: { _id: userId} },
            { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, // allowing empty array of messages. Without "preserveNullAndEmptyArrays: true", toast will show user not found which is not a correct message.
            {$sort: { 'messages.createdAt' : -1 } },
            {$group: {_id: userId, messages: { $push: '$messages'} }  }
        ]).exec();

        //it returns an array;

        // console.log("user", user);
        

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            })
        }
        if(user.length===0){
            return Response.json({
                success: false,
                message: "There is No Message"
            })
        }

        return Response.json({
            messages: user[0].messages}, 
            {status: 200}
        );


    } catch (error) {
        console.error('An unexpected error occurred:', error);
        
        return Response.json(
        { message: 'Internal server error', success: false },
        { status: 500 }
        );
    }



}