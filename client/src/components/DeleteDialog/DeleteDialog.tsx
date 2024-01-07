import React from "react";
import DialogBanner from "../DialogBanner/DialogBanner";
import "./DeleteDialog.css";
import { useDeleteDialog } from "./DeleteDialog.logic";

const DeleteDialog = () => {
  const logic = useDeleteDialog();

  return (
    <div className="deleteDialog-container">
      <DialogBanner icon={<></>} title={"Supprimer"} alert />
      <div className="deleteDialog-content">
        <p>
          Etes-vous sûr de vouloir supprimer votre compte ? <strong>Cela est irréversible !</strong>
        </p>
      </div>
      <div className="deleteDialog-footer">
        <button onClick={logic.handleClose}>Fermer</button>
        <button onClick={logic.handleSubmit} data-cta={true}>
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default DeleteDialog;
