"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Unit } from "@/lib/course";
import { getLearningProgress } from "@/lib/course";
import { cn } from "@/lib/utils";
import { BookOpen, FileQuestion } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LessonSidebarProps {
  courseId: string;
  unitId: string;
  lessonId: string;
  unit: Unit;
  uid: string;
}

export function LessonSidebar({
  courseId,
  unitId,
  lessonId,
  unit,
  uid,
}: LessonSidebarProps) {
  const [progressMap, setProgressMap] = useState<Map<string, string>>(
    new Map(),
  );

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const learningProgress = await getLearningProgress(uid);
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
      }
    };

    fetchProgress();
  }, [uid]);

  return (
    <div className="h-full bg-muted/40">
      <div className="p-4 border-b">
        <h2 className="font-semibold">{unit.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {unit.lessons.length} lessons
        </p>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-4">
          <ol className="space-y-2">
            {unit.lessons.map((lesson, index) => {
              const progress = progressMap.get(lesson.id) || "Not Started";
              const isActive = lesson.id === lessonId;

              return (
                <li key={lesson.id}>
                  <Link
                    href={`/courses/${courseId}/${unitId}/${lesson.id}`}
                    className={cn(
                      "flex items-start gap-4 p-3 rounded-lg",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted transition-colors",
                      progress === "Completed" && "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center flex-1 min-w-0 gap-3">
                      <div className="flex-shrink-0">
                        {lesson.type === "reading" ? (
                          <BookOpen className="w-5 h-5" />
                        ) : (
                          <FileQuestion className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {index + 1}.
                          </span>
                          <span className="text-sm font-medium truncate">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="mt-1">
                          <Badge
                            variant={
                              progress === "Completed"
                                ? "default"
                                : progress === "In Progress"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {progress}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
      </ScrollArea>
    </div>
  );
}
