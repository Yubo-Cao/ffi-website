"use client";

import { setLearningProgress } from "@/lib/course";
import { useState, useEffect } from "react";

export function ProgressUpdater({
  userId,
  lessonId,
}: {
  userId: string;
  lessonId: string;
}) {
  const [isProgressUpdated, setIsProgressUpdated] = useState(false);

  useEffect(() => {
    const updateProgress = async () => {
      if (!isProgressUpdated) {
        try {
          await setLearningProgress(userId, lessonId, "In Progress");
          setIsProgressUpdated(true);
        } catch (error) {
          console.error("Failed to update lesson progress:", error);
        }
      }
    };

    updateProgress();
  }, [userId, lessonId, isProgressUpdated]);

  return <> </>;
}
