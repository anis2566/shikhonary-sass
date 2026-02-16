import { BookText, FileText, HelpCircle, Plus } from "lucide-react";
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
    <TabsContent
      value="subjects"
      className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <Card className="bg-card/40 backdrop-blur-xl border-border/50 rounded-3xl shadow-medium overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20">
          <div>
            <CardTitle className="text-lg font-black tracking-tight">
              All Subjects ({subjects.length})
            </CardTitle>
            <CardDescription className="text-xs font-medium">
              Subjects belonging to {className}
            </CardDescription>
          </div>
          <Button asChild className="rounded-xl font-bold shadow-glow h-9">
            <Link href={`/subjects/create?classId=${classId}`}>
              <Plus className="h-4 w-4 mr-2 stroke-[3]" />
              Add Subject
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
          {subjects.length === 0 ? (
            <div className="text-center py-16 bg-muted/10 rounded-2xl border border-dashed border-border/50">
              <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary shadow-soft">
                <BookText className="size-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                No Subjects Yet
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Get started by adding subjects to this class. Subjects contain
                chapters, topics, and questions.
              </p>
              <Button asChild className="rounded-xl font-bold shadow-glow">
                <Link href={`/subjects/create?classId=${classId}`}>
                  <Plus className="h-4 w-4 mr-2 stroke-[3]" />
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
                    className="block p-5 rounded-2xl border border-border/50 bg-background/50 hover:bg-primary/[0.02] hover:border-primary/20 hover:shadow-glow transition-all duration-300 group shadow-soft"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-soft group-hover:scale-110">
                          <BookText className="size-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight text-base">
                            {subject.displayName}
                          </h3>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">
                            {subject.name}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={subject.isActive ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg",
                          subject.isActive
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-muted text-muted-foreground border-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "size-1 rounded-full mr-1.5",
                            subject.isActive
                              ? "bg-primary animate-pulse"
                              : "bg-muted-foreground",
                          )}
                        />
                        {subject.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-lg border border-border/50 text-[10px] font-bold text-muted-foreground">
                        <FileText className="size-3.5" />
                        <span>{subject._count.chapters} Chapters</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted/50 rounded-lg border border-border/50 text-[10px] font-bold text-muted-foreground">
                        <HelpCircle className="size-3.5" />
                        <span>
                          {subject._count.mcqs + subject._count.cqs} Qs
                        </span>
                      </div>
                      <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <Plus className="size-4" />
                      </div>
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
