'use client';

/** Browser-side signed upload straight to Cloudinary (see /api/admin/uploads/projects/sign). */
export type Signature = { cloudName: string; apiKey: string; timestamp: string; folder: string; signature: string };

export async function getSignature(folder: 'projects' | 'articles' = 'projects'): Promise<Signature> {
  const res = await fetch(`/api/admin/uploads/projects/sign?folder=${folder}`, { method: 'POST', credentials: 'same-origin' });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.ok) throw new Error(json.error || 'Could not authorise upload');
  return json.data;
}

export function uploadToCloudinary(file: File, sig: Signature, onProgress: (p: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', sig.timestamp);
    form.append('folder', sig.folder);
    form.append('signature', sig.signature);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${encodeURIComponent(sig.cloudName)}/image/upload`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total);
    xhr.onload = () => {
      try {
        const body = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300 && typeof body.secure_url === 'string') resolve(body.secure_url);
        else reject(new Error(body.error?.message || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(form);
  });
}

