import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";

export async function GET(request: Request){
    await dbConnect();

    try {
        const {username, verifyCode} =  await request.json()

        const decodedUsername = decodeURIComponent(username);
        // it remove unncesseary detail when we take from url like trim, remove %

        const user= await userModel.findOne({
            username: decodedUsername
        })

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }

        const codeVerification= user.verifyCode === verifyCode

        const isNotExpired= new Date(user.verifyCodeExpiry) > new Date()

        if(codeVerification && isNotExpired){

            user.isVerified= true;
            await user.save()

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, {status: 200})
        } else if(!isNotExpired){
            return Response.json({
                success: false,
                message: "Verification code is Expired, Please sign up again to get a new code."
            }, {status: 400})
        }else{
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            }, {status: 400})
        }
            
        
        
    } catch (error) {
        console.error('Error verifying user:', error);
        return Response.json({ 
            success: false, 
            message: 'Error verifying user' },
            { status: 500 }
        );
    }

}