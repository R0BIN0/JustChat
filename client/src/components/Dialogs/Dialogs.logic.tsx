import { useMemo } from "react";
import { IDialogs } from "../../types/Dialogs/IDialogs";
import DeleteDialog from "../DeleteDialog/DeleteDialog";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import ModifyDialog from "../ModifyDialog/ModifyDialog";

export const useDialogs = () => {
  const isOpen = useSelector((s: IRootState) => s.dialog.isOpen);

  const dialogs = useMemo(
    () => [
      {
        show: isOpen === IDialogs.DELETE,
        component: <DeleteDialog />,
      },
      {
        show: isOpen === IDialogs.MODIFY,
        component: <ModifyDialog />,
      },
    ],
    [isOpen]
  );

  return { isOpen, dialogs };
};
