"use client";

import type React from "react";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/utils/types";
import { useTopLoader } from "nextjs-toploader";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { toast } from "sonner";
import Cookies from "js-cookie";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedData: Partial<UserProfile>, toUpdate: object) => void;
}

const formSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters" })
    .max(50, { message: "Full name must not exceed 50 characters" }),
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .max(50, { message: "Username must not exceed 50 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().optional(),
  bannerImage: z.string().optional(),
  profileImage: z.string().optional(),
  bannerUrl: z.string().optional(),
  profilePicUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onSave,
}: EditProfileModalProps) {
  const topLoader = useTopLoader();
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),

    defaultValues: {
      fullName: userData.fullName,
      username: userData.username,
      email: userData.email,
      bannerImage: userData.bannerImage,
      profileImage: userData.profileImage,
      bannerUrl: "",
      profilePicUrl: "",
    },
  });
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const handleUsernameChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      // setFormData((prev) => ({ ...prev, [name]: value }));

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(async () => {
        try {
          const checkUsername = await axios.get(
            `${BACKEND_URL}api/v1/user/username/check?username=${value}`
          );
          console.log("UN check -- ", checkUsername.data.data.isAvailable);
          if (!checkUsername.data.data.isAvailable) {
            // form.setValue("username", userData.  username);
            if (value != userData.username) {
              form.setError("username", { message: "username taken" });
            } else {
              form.clearErrors("username");
            }
          } else {
            form.clearErrors("username");
          }

          console.log(checkUsername);
        } catch (error) {
          console.error("Error checking username:", error);
          toast.error("Error checking username availability");
        }
      }, 500);
    },
    [form, userData.username]
  );

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await axios.get(
        `${BACKEND_URL}api/v1/user/upload-pic/signature`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      if (!response.status.toString().startsWith("2")) {
        // If the server response is not successful, extract the error text for debugging.
        const errorText = await response.data.message;
        throw new Error(
          `Request failed with status ${response.status}: ${errorText}`
        );
      }

      // Parse and destructure the response JSON for upload credentials.
      const data = await response.data.data;
      const { signature, expire, token, publicKey } = data;
      return { signature, expire, token, publicKey };
    } catch (error) {
      // Log the original error for debugging before rethrowing a new error.
      console.error("Authentication error:", error);
      throw new Error("Imagekit Authentication request failed");
    }
  };

  const handleImageUpload = async (
    file: File,
    folder: "banner" | "profile",
    fileInputRef: React.RefObject<HTMLInputElement>
  ): Promise<{ upload: boolean; url: string }> => {
    topLoader.start();
    console.log("OKKKKK handleImageUpload");
    const fileInput = fileInputRef.current;
    console.log(fileInputRef.current);

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return { upload: false, url: "" };
    }

    // Extract the first file from the file input

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return { upload: false, url: "" };
    }
    const { signature, expire, token, publicKey } = authParams;

    // Call the ImageKit SDK upload function with the required parameters and callbacks.
    try {
      const uploadResponse = await upload({
        // Authentication parameters
        expire,
        token,
        signature,
        publicKey,
        file,
        folder: folder === "banner" ? "/banners/" : "/profiles/",
        fileName: `${userData.username}_${folder}.${file.type.replace(
          /(.*)\//g,
          ""
        )}`,
        // Progress callback to update upload progress state
        onProgress: (event) => {
          topLoader.setProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      console.log("Upload response:", uploadResponse);
      topLoader.done();
      return { upload: true, url: uploadResponse.url as string };
    } catch (error) {
      // Handle specific error types provided by the ImageKit SDK.
      if (error instanceof ImageKitAbortError) {
        console.error("Upload aborted:", error.reason);
      } else if (error instanceof ImageKitInvalidRequestError) {
        console.error("Invalid request:", error.message);
      } else if (error instanceof ImageKitUploadNetworkError) {
        console.error("Network error:", error.message);
      } else if (error instanceof ImageKitServerError) {
        console.error("Server error:", error.message);
      } else {
        // Handle any other errors that may occur.
        console.error("Upload error:", error);
      }
      toast.error("faild to update picture! try again later.");
      topLoader.done();
      return { upload: false, url: "" };
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileUrl = handleImageUpload(
          file,
          "banner",
          bannerInputRef as React.RefObject<HTMLInputElement>
        );
        fileUrl.then((response) => {
          if (!response.upload) {
            toast.error("Failed to upload banner image");
          }
          form.setValue("profilePicUrl", response.url);
          form.setValue("bannerImage", reader.result as string);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("OKKKKK handleImageChange");

    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(profilePicInputRef);

        const fileUrl = handleImageUpload(
          file,
          "profile",
          profilePicInputRef as React.RefObject<HTMLInputElement>
        );
        fileUrl.then((response) => {
          if (!response.upload) {
            toast.error("Failed to upload banner image");
          }

          console.log("handleProfileImageChange" , response.url);
          
          console.log("FURL - ", form.watch("profilePicUrl"));

          form.setValue("profilePicUrl", response.url);
          form.setValue("profileImage", reader.result as string);
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSaving(true);
    console.log("data form -",data);
    onSave(data, {
      bannerUrl: data.bannerUrl,
      profilePicUrl: data.profilePicUrl,
      username: data.username,
      fullName: data.fullName,
    });
    setIsSaving(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <Card className="w-full max-w-md">
        <div className="flex items-center justify-between border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">Edit Profile</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-6"
          >
            {/* Banner Picture */}
            <div className="flex flex-col items-center gap-4">
              <Image
                src={form.watch("bannerImage") || "/placeholder.svg"}
                alt="Banner"
                width={400}
                height={100}
                className="h-24 w-full rounded-md object-cover"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  ref={bannerInputRef}
                  onChange={handleBannerChange}
                  className="hidden"
                />
                <input hidden defaultValue={form.watch("bannerUrl")} type="text" />
                <span className="text-sm font-medium text-primary hover:underline">
                  Change Banner
                </span>
              </label>
            </div>

            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-4 border-primary">
                <AvatarImage
                  src={form.watch("profileImage") || "/placeholder.svg"}
                  alt="Profile"
                />
                <AvatarFallback>{form.watch("fullName").charAt(0)}</AvatarFallback>
              </Avatar>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  ref={profilePicInputRef}
                  onChange={handleProfileImageChange}
                  className="hidden"
                />
                <input hidden defaultValue={form.watch("profilePicUrl")} type="text" />
                <span className="text-sm font-medium text-primary hover:underline">
                  Change Picture
                </span>
              </label>
            </div>

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleUsernameChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" disabled {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
}
