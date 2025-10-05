import { toast } from "sonner";

type shareDataType = {
  title: string;
  text: string;
  url: string;
};
export const handleShare = (shareData: shareDataType) => {
  try {
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      toast("Link copied to clipboard!");
    }
  } catch (error) {
    console.error("Error sharing:", error);
  }
};
