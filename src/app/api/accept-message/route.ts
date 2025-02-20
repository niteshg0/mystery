import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

    const session= await getServerSession(authOptions)
    const user= session?.user;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 400})
    }

    const {acceptMessage}= await request.json()
    // console.log("acceptmessage",acceptMessage);
    

    try {
        const updatedUser= await userModel.findByIdAndUpdate(user?._id, 
            { isAcceptingMessage: acceptMessage},
            {new: true} )
    
            // By default, findOneAndUpdate() returns the document as it was before update was applied. If you set new: true, findOneAndUpdate() will instead give you the object after update was applied.

        if(!updatedUser){
            return Response.json(
                {
                  success: false,
                  message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }

        return Response.json({
              success: true,
              message: 'Message acceptance status updated successfully',
              updatedUser,
            },{ status: 200 }
        );
    } catch (error) {
        console.error('Error updating message acceptance status:', error);

        return Response.json({ 
            success: false,
            message: 'Error updating message acceptance status' },
            { status: 500 }
        );
    }
}

export async function GET(request: Request){
    await dbConnect();

    const session= await getServerSession(authOptions)
    const user= session?.user;

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 400})
    }

    const userId= user?._id;

    try {
        const foundUser= await userModel.findById(userId);

        if(!foundUser){
            return Response.json(
                {
                  success: false,
                  message: 'Unable to find user to check message acceptance status',
                },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
            
          },{ status: 200 }
      );

    

    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
          { success: false, message: 'Error retrieving message acceptance status' },
          { status: 500 }
        );
    }

}