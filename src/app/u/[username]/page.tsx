"use client";
import { useParams } from "next/navigation";
import React from "react";
import { messageSchema } from "@/schemas/messageSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
const profile = () => {
  const params = useParams<{ username: string }>();
  const { username } = params;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "Please enter your message here! ",
    },
  });
  const onSubmit = async (content: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content,
      });
      toast.success(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.error(axiosError.response?.data.message || "An error occured while sending message")
      
      
    }
  };
  return <div>profile</div>;
};

export default profile;
