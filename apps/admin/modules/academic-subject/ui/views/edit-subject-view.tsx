import { EditSubjectForm } from "../form/edit-subject-form";

interface EditSubjectViewProps {
  subjectId: string;
}

export const EditSubjectView = ({ subjectId }: EditSubjectViewProps) => {
  return <EditSubjectForm subjectId={subjectId} />;
};
