import { EditTopicForm } from "../form/edit-topic-form";

interface EditTopicViewProps {
  topicId: string;
}

export const EditTopicView = ({ topicId }: EditTopicViewProps) => {
  return <EditTopicForm topicId={topicId} />;
};
