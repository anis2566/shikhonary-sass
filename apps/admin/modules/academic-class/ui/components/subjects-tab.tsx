import { BookText, FileText, Hash, HelpCircle, Plus } from "lucide-react";
import Link from "next/link";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { TabsContent } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

import { AcademicSubject } from "@workspace/db";

type SubjectWithRelation = AcademicSubject & {
  _count: {
    chapters: number;
    mcqs: number;
    cqs: number;
  };
};

interface SubjectsTabProps {
  subjects: SubjectWithRelation[];
  className?: string;
  classId: string;
}

export const SubjectsTab = ({
  subjects,
  className,
  classId,
}: SubjectsTabProps) => {
  return (
    <TabsContent value="subjects" className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>All Subjects ({subjects.length})</CardTitle>
            <CardDescription>Subjects belonging to {className}</CardDescription>
          </div>
          <Button asChild>
            <Link href={`/subjects/create?classId=${classId}`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Subject
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {subjects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <BookText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Subjects Yet</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
                Get started by adding subjects to this class. Subjects contain
                chapters, topics, and questions.
              </p>
              <Button asChild>
                <Link href={`/subjects/create?classId=${classId}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Subject
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {subjects.map((subject) => {
                return (
                  <Link
                    key={subject.id}
                    href={`/subjects/${subject.id}`}
                    className="block p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all group bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <BookText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {subject.displayName}
                          </h3>
                          <p className="text-xs text-muted-foreground font-mono">
                            {subject.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={subject.isActive ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          subject.isActive &&
                            "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400",
                        )}
                      >
                        {subject.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {subject._count.chapters} chapters
                      </span>
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5" />
                        {subject._count.mcqs + subject._count.cqs} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Hash className="h-3.5 w-3.5" />#{subject.position}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
