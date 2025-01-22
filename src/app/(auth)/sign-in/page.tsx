"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/schemas/signInSchema"
import {z} from 'zod'
import { useState } from "react"
import {useDebounceValue} from 'usehooks-ts'
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"

// export function ProfileForm() {
//     // 1. Define your form.
//     const form = useForm<z.infer<typeof signInSchema>>({
//       resolver: zodResolver(signInSchema),
//       defaultValues: {
//         identifier: "",
//       },
//     })
   
//     // 2. Define a submit handler.
//     function onSubmit(values: z.infer<typeof signInSchema>) {
//       // Do something with the form values.
//       // ✅ This will be type-safe and validated.
//       console.log(values)
//     }

//     return (
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="username"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Username</FormLabel>
//                   <FormControl>
//                     <Input placeholder="shadcn" {...field} />
//                   </FormControl>
//                   <FormDescription>
//                     This is your public display name.
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit">Submit</Button>
//           </form>
//         </Form>
//       )
//   }


const page= ()=>{
    const [username, setUsername]= useState('');
    const [usernameMessage, setUsernameMessage]= useState('')
    const [ischecking, setIschecking]= useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false)

    const debouncedUsername= useDebounceValue(username, 300)

    const { toast } = useToast()
    const router = useRouter();

    //zod resolver
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {

        }
    })

    return (
        <div>Page</div>
    )
}

export default page;