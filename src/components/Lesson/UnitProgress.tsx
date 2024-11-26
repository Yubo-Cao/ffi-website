"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLearningProgress } from "@/lib/course";
import { useEffect, useState } from "react";

interface UnitProgressProps {
  unitLessonIds: string[];
  userId: string;
}

function calculateUnitProgress(
  unitLessonIds: string[],
  progressMap: Map<string, string>,
) {
  const completedLessons = unitLessonIds.filter(
    (id) => progressMap.get(id) === "Completed",
  ).length;
  const inProgressLessons = unitLessonIds.filter(
    (id) => progressMap.get(id) === "In Progress",
  ).length;

  if (completedLessons === unitLessonIds.length) {
    return "Completed";
  } else if (completedLessons > 0 || inProgressLessons > 0) {
    return "In Progress";
  }
  return "Not Started";
}

function getProgressPercentage(
  unitLessonIds: string[],
  progressMap: Map<string, string>,
) {
  const completedLessons = unitLessonIds.filter(
    (id) => progressMap.get(id) === "Completed",
  ).length;
  const inProgressLessons = unitLessonIds.filter(
    (id) => progressMap.get(id) === "In Progress",
  ).length;

  return Math.round(
    (completedLessons * 100 + inProgressLessons * 50) / unitLessonIds.length,
  );
}

export function UnitProgress({ unitLessonIds, userId }: UnitProgressProps) {
  const [progressMap, setProgressMap] = useState<Map<string, string>>(
    new Map(),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const learningProgress = await getLearningProgress(userId);
        setProgressMap(
          new Map(
            learningProgress.map((progress) => [
              progress.lessonId,
              progress.progress,
            ]),
          ),
        );
      } catch (error) {
        console.error("Failed to fetch learning progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [userId, unitLessonIds]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="invisible text-muted-foreground">Loading...</span>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <Progress value={0} className="h-2" />
      </div>
    );
  }

  const progress = calculateUnitProgress(unitLessonIds, progressMap);
  const progressPercentage = getProgressPercentage(unitLessonIds, progressMap);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {unitLessonIds.length} Lessons
        </span>
        <Badge
          variant={
            progress === "Completed"
              ? "default"
              : progress === "In Progress"
                ? "secondary"
                : "outline"
          }
        >
          {progress}
        </Badge>
      </div>
      <Progress value={progressPercentage} className="h-2" />
    </div>
  );
}
