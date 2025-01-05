import mongoose, {Schema, Document} from "mongoose";


export interface message extends Document{
    content: string;
    createdAt: Date;
    // createdBy: string;
}


const messageSchema: Schema<message>= new Schema({
    content: {
        type: String,
        required: true,
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface user extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: message[]
}


const userSchema : Schema<user>= new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim:true,
        unique:true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique:true,
        match: [/.+\@.+\..+/, "Please use your Email"]
    },
    password: {
        type: String,
        required:[true, "Password is required"],
        

    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code is required"],
        

    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
        

    },
    isAcceptingMessage: {
        type: Boolean,
        required: true,
        

    },
    isVerified:{
        type: Boolean,
        required: [true, "Verfication Required"],
        default: false, 
    },
    messages: [messageSchema]
})

const userModel = (mongoose.models.user as mongoose.Model<user>) || (mongoose.model<user>("user", userSchema))

export default userModel;



