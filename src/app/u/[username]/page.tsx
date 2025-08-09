"use client";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { messageSchema } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const UserProfilePage = () => {
  const { completion, complete, isLoading, error } = useCompletion({
    api: "/api/suggest-messages",
    experimental_throttle: 50
  });
  const params = useParams<{ username: string }>();
  const { username } = params;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const [isSending, setIsSending] = useState(false);
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "An error occured while sending message"
      );
    } finally {
      setIsSending(false);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center flex-col mt-10 mb-10 p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Please enter your message here! "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait!
                </>
              ) : (
                "Send it!"
              )}
            </Button>
          </form>
        </Form>
      </div>

      <div className="flex flex-col items-center space-y-4 ml-8">
        <h1 className="text-center text-4xl">Message Suggestions</h1>
        <Button
          onClick={(e) => {
            
            return complete("");
          }}
          disabled={isLoading}
        >
          Suggest Messages
        </Button>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <></>}

        
        <div className="justify-center">
          
          

        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
