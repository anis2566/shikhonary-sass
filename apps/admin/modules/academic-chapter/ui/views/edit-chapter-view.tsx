import { EditChapterForm } from "../form/edit-chapter-form";

interface EditChapterProps {
  chapterId: string;
}

export const EditChapterView = ({ chapterId }: EditChapterProps) => {
  return <EditChapterForm chapterId={chapterId} />;
};
