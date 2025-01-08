import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from 'zod'
import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

const usernameQuerySchema= z.object({
    username: usernameValidation
})

export async function GET(request: Request){


    await dbConnect();

    try {
        const searchParams= new URL(request.url).searchParams
        const queryParams = {
            username: searchParams.get('username')
        }

        //validate with zod
        const result= usernameQuerySchema.safeParse(queryParams);
        console.log(result);

        if(!result.success){
            return Response.json({
                sussess: false,
                message: "Invalid Query parameter"
            }, {status: 400})
            console.error(result.error?.format().username?._errors || [])
        }

        const {username}= result.data;

        const existingVerifiedUser= await userModel.findOne({
            username,
            isVerified: true,
        })

        if(existingVerifiedUser){
            return Response.json({
                sussess: false,
                message: "Username  already exist"
            }, {status: 400})
        }
        
        return Response.json({
            sussess: true,
            message: "Username is unique"
        })

    } catch (error) {
        console.error("Error checking in username");
        return Response.json({
            success: true,
            message: "Error checking in username"
        },{status: 500})
    }
}