"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Share2 } from "lucide-react";

interface ShareDialogProps {
  shareLink: string;
}


export default function ShareDialog({shareLink}:ShareDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="cursor-pointer">
          <Share2 className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          {shareLink}
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
