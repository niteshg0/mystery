"use client"

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, RefreshCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useCallback, useEffect, useMemo, useState } from "react"
import { message } from "@/model/User"
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { User } from 'next-auth';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import SkeletonCard from '@/components/SkeletonCard';



const page = () => {
  const [messages, setMessages]= useState<message []>([]);
  const [isLoading, setIsLoading]= useState(false);
  const [isSwitchLoading, setIsSwitchLoading]= useState(false);

  const {toast}= useToast()

  const {data: session}= useSession()

  // if(!session || !session.user){
  //   return <div></div>
  // }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue}= form;
  const acceptMessages= watch('acceptMessages');
  // console.log(acceptMessages); //true false
  

  const handleSwitchChange= async ()=>{
    try {
      setIsSwitchLoading(true)
      const res= await axios.post('/api/accept-message', {acceptMessage: !acceptMessages})

      setValue('acceptMessages', !acceptMessages)

      setIsSwitchLoading(false)

      toast({
        title: res.data.message,
      })

    } catch (error) {
      const axiosError= error as AxiosError<ApiResponse>

      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  }

  const fetchMessages= useCallback(
    async (refresh: boolean= false)=>{

        setIsLoading(true);
        setIsSwitchLoading(false);
    
    
        try {
          const response= await axios.get('/api/get-message');
          console.log("msg", response);
          
    
          setMessages(response.data.messages || []);
          
          if(refresh){
            toast({
              title: "Refreshed Messages",
              description: "Showing latest messages"
            })
          }
          
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;

            toast({
              title: 'Error',
              description:
                axiosError.response?.data.message ?? 'Failed to fetch messages',
              variant: 'destructive',
            });
        } finally{
          setIsLoading(false);
          setIsSwitchLoading(false)
        }
    
    }, [toast, setIsLoading, setMessages]);

    const fetchAcceptMessages= useCallback(
      async ()=>{
          setIsSwitchLoading(true);
    
          try {
            const response= await axios.get('/api/accept-message');
    
            setValue('acceptMessages', response.data.isAcceptingMessage)
    
          } catch (error) {
              const axiosError = error as AxiosError<ApiResponse>;
              toast({
                title: 'Error',
                description:
                  axiosError.response?.data.message ??
                  'Failed to fetch message settings',
                variant: 'destructive',
              });
    
          } finally{
            setIsSwitchLoading(false)
          }
        
    }, [setValue, toast])

    useEffect(()=>{
      if (!session || !session.user) return;

      fetchMessages();

      fetchAcceptMessages();

    }, [session, toast, setValue, fetchMessages, fetchAcceptMessages ])

    const handleDeleteMessage= async (messageId: string)=>{
      setMessages(messages.filter((message)=> message._id !== messageId ))
    }

  

  // console.log(window);
  // const {username}= session?.user as User;

  // const baseUrl= `${window.location.origin}`;
  // const profileUrl= `${baseUrl}/u/${session?.user.username}`
  const profileUrl = useMemo(() => `${window.location.origin}/u/${session?.user.username}`, [session]);


  const copyToClipboard= async ()=>{
     await navigator.clipboard.writeText(profileUrl)

    toast({
      title: "URL copied",
      description: "Profile URL is copied"
    })
  }
  
  

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button 
          onClick={copyToClipboard}
          >Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {( isLoading || isSwitchLoading) ? (
          <>
          <SkeletonCard></SkeletonCard>
          <SkeletonCard></SkeletonCard>
          <SkeletonCard></SkeletonCard>
          <SkeletonCard></SkeletonCard>
          </>
        ) : (
          messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={(message as any)?._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )
        )}
      </div>
    </div>
  )
}
export default page