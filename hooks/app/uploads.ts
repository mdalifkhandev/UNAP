import api from '@/api/axiosInstance';
import { useMutation } from '@tanstack/react-query';

type SignatureResponse = {
  timestamp: number;
  signature: string;
  apiKey: string;
  cloudName: string;
  folder: string;
  resourceType: string;
  publicId: string | null;
};

export const useUploadSignature = () => {
  return useMutation({
    mutationFn: async (payload: { folder: string; resourceType: string }) => {
      const res = await api.post('/api/uploads/signature', payload);
      return res as unknown as SignatureResponse;
    },
  });
};

export const useUploadVideoToCloudinary = () => {
  return useMutation({
    mutationFn: async (payload: {
      signature: SignatureResponse;
      uri: string;
      fileName?: string | null;
    }) => {
      const { signature, uri, fileName } = payload;
      const form = new FormData();
      form.append('file', {
        uri,
        name: fileName || `video-${Date.now()}.mp4`,
        type: 'video/mp4',
      } as any);
      form.append('api_key', signature.apiKey);
      form.append('timestamp', signature.timestamp.toString());
      form.append('signature', signature.signature);
      form.append('folder', signature.folder || 'mister/posts');

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/video/upload`;
      const res = await fetch(uploadUrl, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Cloud upload failed');
      }
      return res.json();
    },
  });
};
