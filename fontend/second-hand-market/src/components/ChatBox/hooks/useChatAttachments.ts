import { useState, useCallback, useRef } from "react";
import { Attachment } from "../types/ChatBox.types";
import ApiService from "../../../services/ApiService";

export const useChatAttachments = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addAttachment = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const attachment: Attachment = {
        id: Date.now() + Math.random(),
        file,
        preview: e.target?.result as string,
        type: file.type,
        name: file.name,
      };
      setAttachments((prev) => [...prev, attachment]);
    };
    reader.readAsDataURL(file);
  }, []);

  const removeAttachment = useCallback((id: string | number) => {
    setAttachments((prev) => prev.filter((att) => att.id !== id));
  }, []);

  const clearAttachments = useCallback(() => {
    setAttachments([]);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        Array.from(files).forEach((file) => {
          addAttachment(file);
        });
      }
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [addAttachment]
  );

  const uploadAttachments = useCallback(async (): Promise<any[]> => {
    if (attachments.length === 0) return [];

    setIsUploading(true);
    try {
      const uploadPromises = attachments.map(async (attachment) => {
        const formData = new FormData();
        formData.append("file", attachment.file);

        const response = await ApiService.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          type: attachment.type,
          url: response.data.url || response.data.fileUrl,
          name: attachment.name,
          _id: response.data._id || response.data.id,
        };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      return uploadedFiles;
    } catch (error) {
      console.error("Error uploading attachments:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [attachments]);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    attachments,
    isUploading,
    fileInputRef,
    addAttachment,
    removeAttachment,
    clearAttachments,
    handleFileInputChange,
    uploadAttachments,
    openFileDialog,
  };
};
