"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { updateLessonProgress } from "@/lib/course";
import { useTransition } from "react";

export default function UpdateProgressButton({
  lessonId,
  userId,
  currentProgress,
}: {
  lessonId: string;
  userId: string;
  currentProgress?: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleProgressUpdate = () => {
    let newProgress: string;

    switch (currentProgress) {
      case "Not Started":
        newProgress = "In Progress";
        break;
      case "In Progress":
        newProgress = "Completed";
        break;
      case "Completed":
        newProgress = "Not Started";
        break;
      default:
        newProgress = "In Progress";
    }

    startTransition(() => {
      updateLessonProgress(userId, lessonId, newProgress).catch((error) => {
        console.error("Failed to update progress:", error);
        toast({
          title: "Error",
          description: "Failed to update progress. Please try again.",
          variant: "destructive",
        });
      });
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => {
        e.preventDefault();
        handleProgressUpdate();
      }}
      disabled={isPending}
    >
      {isPending ? (
        <span className="loading loading-spinner loading-sm" />
      ) : (
        "Update Progress"
      )}
    </Button>
  );
}
