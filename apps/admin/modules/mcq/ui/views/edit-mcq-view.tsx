"use client";

import { useMCQById } from "@workspace/api-client";
import { EditMcqForm } from "../form/edit-mcq-form";
import { MCQFormValues } from "@workspace/schema";

interface EditMcqViewProps {
  id: string;
}

export const EditMcqView = ({ id }: EditMcqViewProps) => {
  const { data: mcq } = useMCQById(id);

  if (!mcq) return null;

  const formData: MCQFormValues & { id: string } = {
    id: mcq.id,
    question: mcq.question,
    answer: mcq.answer,
    chapterId: mcq.chapterId,
    subjectId: mcq.subjectId,
    topicId: mcq.topicId ?? "",
    subTopicId: mcq.subTopicId ?? "",
    options: mcq.options,
    type: mcq.type,
    isMath: mcq.isMath,
    reference: mcq.reference ?? [],
    explanation: mcq.explanation ?? "",
    context: mcq.context ?? "",
    statements: mcq.statements ?? [],
    session: mcq.session,
    source: mcq.source ?? "",
  };

  return <EditMcqForm mcq={formData} />;
};
