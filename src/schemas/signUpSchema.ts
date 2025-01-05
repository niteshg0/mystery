import {z} from 'zod'

export const usernameValidation= z
    .string()
    .min(2, "Username must be have atleast 2 charachters")
    .max(20, "Username can have maximum 20 charchters")
    .regex(/^[a-zA-Z0-9_]/, "Username must not have special characters")



export const signUpSchema= z.object({
    username: usernameValidation,
    email:  z.string().email({message: "Invalid email Address"}),
    password: z.string().min(6, {message: "Password must have atleast 6 Characters"})

})
