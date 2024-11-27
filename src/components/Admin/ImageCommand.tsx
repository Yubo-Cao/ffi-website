// @/components/editor/image-command.tsx
import { Upload } from "lucide-react";

export const imageCommand = {
  name: "image",
  keyCommand: "image",
  buttonProps: { "aria-label": "Insert image" },
  icon: <Upload className="w-4 h-4" />,
  execute: async (state: any, api: any) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const { url } = await response.json();
        const imageMarkdown = `![](${url})`;
        api.replaceSelection(imageMarkdown);
      } catch (err) {
        console.error("Failed to upload image:", err);
      }
    };

    input.click();
  },
};
