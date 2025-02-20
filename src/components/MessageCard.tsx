"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { message } from '../model/User'
import { useToast } from "@/hooks/use-toast"
import { ApiResponse } from "@/types/ApiResponse"
import axios from "axios"

import dayjs from 'dayjs';

type MessageCardtype= {
    message:  message;
    onMessageDelete: (messageId: string)=> void;
}

export function MessageCard({message, onMessageDelete}: MessageCardtype){
    
    const {toast} = useToast();

    const handleDelete= async ()=>{
        try {
            const response= await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)

            toast({
                description: response.data.message
            })

            onMessageDelete(message._id as string)
        } catch (error) {
            console.log("Error in Message Card", error);
        }
    }

    return(
        
        <Card className="card-bordered">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{message.content}</CardTitle>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant='destructive'>
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="text-sm">
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
          </div>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
       

    )
}