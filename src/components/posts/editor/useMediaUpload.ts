import { toast } from "sonner";
import { uploadFiles } from "@/lib/uploadthing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export default function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>();

  async function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error("Please wait for the current upload to finish.");
      return;
    }

    if (attachments.length + files.length > 5) {
      toast.error("You can only upload up to 5 attachments per post.");
      return;
    }

    // Add files to attachments with uploading state
    const renamedFiles = files.map((file) => {
      const extension = file.name.split(".").pop();
      return new File(
        [file],
        `attachment_${crypto.randomUUID()}.${extension}`,
        {
          type: file.type,
        },
      );
    });

    setAttachments((prev) => [
      ...prev,
      ...renamedFiles.map((file) => ({ file, isUploading: true })),
    ]);

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const uploadResults = await uploadFiles("attachment", { 
        files: renamedFiles,
        onUploadProgress: ({ progress }) => {
          setUploadProgress(progress);
        }
      });

      // Update attachments with media IDs
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = uploadResults.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    } catch (error: any) {
      // Remove failed uploads from attachments
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploading(false);
      setUploadProgress(undefined);
    }
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setIsUploading(false);
    setUploadProgress(undefined);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}