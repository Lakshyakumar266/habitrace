"use client";

import type React from "react";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import Image from "next/image";
import { UserProfile } from "@/utils/types";

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

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserProfile;
  onSave: (updatedData: Partial<UserProfile>) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userData,
  onSave,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    username: userData.username,
    fullName: userData.fullName,
    email: userData.email,
    profileImage: userData.profileImage,
    BannerUrl: "",
    ProfilePicUrl: "",
    bannerImage: userData.bannerImage,
  });
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const InputRef = useRef<HTMLInputElement>(null);

  const [BannerUrl, SetBannerUrl] = useState("");
  const [ProfilePicUrl, SetProfilePicUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const authenticator = async () => {
    try {
      // Perform the request to the upload authentication endpoint.
      const response = await axios.get(`${BACKEND_URL}upload-pic/signature`);
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
    fileInputRef: React.RefObject<HTMLInputElement>
  ): Promise<{ upload: boolean; url?: string }> => {
    const fileInput = fileInputRef.current;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file to upload");
      return { upload: false };
    }

    // Extract the first file from the file input

    // Retrieve authentication parameters for the upload.
    let authParams;
    try {
      authParams = await authenticator();
    } catch (authError) {
      console.error("Failed to authenticate for upload:", authError);
      return { upload: false };
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
        fileName: file.name, // Optionally set a custom file name
        // Progress callback to update upload progress state
        onProgress: (event) => {
          // setProgress((event.loaded / event.total) * 100);
          toast.info(`Upload Progress: ${Math.round((event.loaded / event.total) * 100)}%`);
        },
      });
      console.log("Upload response:", uploadResponse);
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
      return { upload: false };
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          bannerImage: reader.result as string,
        }));
        const fileUrl = handleImageUpload(file, bannerInputRef);
        fileUrl.then((fileUrl) => {
          if (!fileUrl.upload) {
            toast.error("Failed to upload banner image");
          } else {
            SetProfilePicUrl(fileUrl.url as string);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
        const fileUrl = handleImageUpload(file);
        fileUrl.then((fileUrl) => {
          if (!fileUrl.upload) {
            toast.error("Failed to upload banner image");
          } else {
            SetProfilePicUrl(fileUrl.url as string);
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(formData);
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

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Banner Picture */}
          <div className="flex flex-col items-center gap-4">
            <Image
              src={formData.bannerImage || "/placeholder.svg"}
              alt="Banner"
              width={400}
              height={100}
              className="h-24 w-full rounded-md object-cover"
            />
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
              <input hidden value={BannerUrl} type="file" />
              <span className="text-sm font-medium text-primary hover:underline">
                Change Banner
              </span>
            </label>
          </div>

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage
                src={formData.profileImage || "/placeholder.svg"}
                alt="Profile"
              />
              <AvatarFallback>{formData.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <input hidden value={ProfilePicUrl} type="file" />
              <span className="text-sm font-medium text-primary hover:underline">
                Change Picture
              </span>
            </label>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your username"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your email"
            />
          </div>

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
      </Card>
    </div>
  );
}
