"use client";

import { EditSubTopicForm } from "../form/edit-sub-topic-form";

interface EditSubTopicViewProps {
  subTopicId: string;
}

export const EditSubTopicView = ({ subTopicId }: EditSubTopicViewProps) => {
  return <EditSubTopicForm subTopicId={subTopicId} />;
};
