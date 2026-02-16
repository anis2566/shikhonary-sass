import { ChevronRight, FileText, Plus, Layers, HelpCircle } from "lucide-react";
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

interface ChapterWithRelation {
  id: string;
  name: string;
  displayName: string;
  isActive: boolean;
  position: number;
  _count?: {
    topics: number;
    mcqs: number;
    cqs: number;
  };
}

interface ChaptersTabProps {
  chapters: ChapterWithRelation[];
  subjectId: string;
}

export const ChaptersTab = ({ chapters, subjectId }: ChaptersTabProps) => {
  return (
    <TabsContent
      value="chapters"
      className="mt-0 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <Card className="bg-card/50 backdrop-blur-md border-border/50 rounded-3xl overflow-hidden shadow-soft">
        <CardHeader className="flex flex-row items-center justify-between pb-6 bg-muted/30 border-b border-border/50 space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-2xl text-primary shadow-soft">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-black tracking-tight">
                Academic Catalog ({chapters.length})
              </CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-70">
                Full list of chapters in this subject
              </CardDescription>
            </div>
          </div>
          <Button
            asChild
            className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-9 px-4 shadow-glow"
          >
            <Link href={`/chapters/create?subjectId=${subjectId}`}>
              <Plus className="h-3.5 w-3.5 mr-2 stroke-[3]" />
              Add Chapter
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-8">
          {chapters.length === 0 ? (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border/50">
              <div className="size-16 bg-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border/50">
                <FileText className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-black text-foreground mb-1">
                No Chapters Yet
              </p>
              <p className="text-sm text-muted-foreground mb-8 max-w-xs mx-auto font-medium">
                Your curriculum repository is currently empty. Start building it
                out by adding your first chapter.
              </p>
              <Button
                asChild
                size="lg"
                className="rounded-xl font-black tracking-tight shadow-glow hover:scale-105 transition-all"
              >
                <Link href={`/chapters/create?subjectId=${subjectId}`}>
                  <Plus className="h-4 w-4 mr-2 stroke-[3]" />
                  Create First Chapter
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {chapters.map((chapter, idx) => (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.id}`}
                  className="flex items-center justify-between p-5 rounded-2xl border border-border/50 bg-background/30 hover:bg-background/80 hover:border-primary/30 hover:shadow-glow transition-all duration-300 group"
                >
                  <div className="flex items-center gap-5">
                    <div className="size-12 rounded-xl bg-muted/50 flex items-center justify-center text-foreground font-black text-sm border border-border/50 group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-all shadow-soft">
                      {String(idx + 1).padStart(2, "0")}
                    </div>
                    <div>
                      <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight text-base">
                        {chapter.displayName}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em] flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/30">
                          <Layers className="size-3" />
                          {chapter._count?.topics || 0} Topics
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.1em] flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-lg border border-border/30">
                          <HelpCircle className="size-3" />
                          {(chapter._count?.mcqs || 0) +
                            (chapter._count?.cqs || 0)}{" "}
                          items
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <Badge
                      variant={chapter.isActive ? "default" : "secondary"}
                      className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border-2",
                        chapter.isActive
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-muted text-muted-foreground border-transparent",
                      )}
                    >
                      <span
                        className={cn(
                          "size-1.5 rounded-full mr-2",
                          chapter.isActive
                            ? "bg-green-500 animate-pulse"
                            : "bg-muted-foreground",
                        )}
                      />
                      {chapter.isActive ? "Live" : "Draft"}
                    </Badge>
                    <div className="size-9 rounded-full border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 group-hover:bg-primary/5 transition-all duration-300">
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};
