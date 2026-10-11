"use client";

import { CldUploadWidget } from "next-cloudinary";

type ImageUploadProps = {
  // Called with the Cloudinary secure URL after a successful upload
  onUpload: (url: string) => void;
  // Show a preview when a URL is already set
  imageUrl?: string;
};

// The browser widget needs these public env vars (see .env.example)
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function ImageUpload({ onUpload, imageUrl }: ImageUploadProps) {
  // Explain what is missing instead of crashing when the env vars are not set
  if (!cloudName || !uploadPreset) {
    return (
      <p className="rounded-md border border-leo-yellow/40 bg-leo-yellow/10 px-3 py-2 text-sm text-leo-gray">
        Image upload is not configured yet. Add
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env.local.
      </p>
    );
  }

  return (
    <div>
      <CldUploadWidget
        config={{ cloud: { cloudName } }}
        uploadPreset={uploadPreset}
        options={{
          multiple: false,
          resourceType: "image",
          sources: ["local", "camera", "url"],
          // Only common image types, max 5 MB (security rules)
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
          maxImageFileSize: 5 * 1024 * 1024,
        }}
        onSuccess={(result) => {
          const info = result.info;
          const url = typeof info === "string" ? info : info?.secure_url;
          if (url) onUpload(url);
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="inline-flex items-center gap-2 rounded-md border border-leo-blue/30 bg-leo-blue/5 px-4 py-2 text-sm font-medium text-leo-blue transition-colors hover:bg-leo-blue/10"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M4 14.9A7 7 0 1 1 15.7 8h1.8a4.5 4.5 0 0 1 2.5 8.2" />
              <path d="M12 12v9" />
              <path d="m8 17 4-4 4 4" />
            </svg>
            Upload Image
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Uploaded"
          className="mt-3 max-h-40 rounded-md border border-leo-gray/20 object-cover"
        />
      )}
    </div>
  );
}
