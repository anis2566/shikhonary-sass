import { EditClassForm } from "../form/edit-class-form";

interface EditClassProps {
  classId: string;
}

export const EditClassView = ({ classId }: EditClassProps) => {
  return <EditClassForm classId={classId} />;
};
