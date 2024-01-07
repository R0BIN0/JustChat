import React from "react";
import DialogBanner from "../DialogBanner/DialogBanner";
import Avatar from "../Avatar/Avatar";
import Input from "../Input/Input";
import EmailValidation from "../EmailValidation/EmailValidation";
import { useModifyDialog } from "./ModifyDialog.logic";
import FormSubmitButton from "../FormSubmitButton/FormSubmitButton";
import "./ModifyDialog.css";
import { IErrorCode } from "../../apis/IErrorCode";

const ModifyDialog = () => {
  const logic = useModifyDialog();

  const emailError = logic.error && logic.error.code === IErrorCode.SAME_EMAIL;
  const nameError = logic.error && logic.error.code === IErrorCode.NAME_ALREADY_USED;

  return (
    <div className="modifyDialog-container">
      <DialogBanner icon={<></>} title={"Modifier"} />
      <div className="modifyDialog-content">
        <div className="form-avatar-container">
          <Avatar handleAvatar={logic.handleAvatar} defaultAvatar={logic.avatarRef.current} />
        </div>
        <form className="form-form" onSubmit={logic.handleSubmitAsync}>
          <fieldset>
            <div className="form-input-global-container">
              <div className="form-input-container">
                <Input
                  type={{ otherValue: "text" }}
                  id="name"
                  placeholder="Nom d'utilisateur"
                  value={logic.name}
                  onChange={logic.handleInput}
                  error={false}
                />
                <EmailValidation isValid={!!logic.name} />
              </div>
              {logic.error?.message && nameError && <span className="modifyDialog-input-error">{logic.error.message}</span>}
            </div>
            <div className="form-input-global-container">
              <div className="form-input-container">
                <Input
                  type={{ otherValue: "text" }}
                  id="email"
                  placeholder="Email"
                  value={logic.email}
                  onChange={logic.handleInput}
                  error={false}
                />
                <EmailValidation isValid={logic.form.emailIsValid} />
              </div>

              {logic.error?.message && emailError && <span className="modifyDialog-input-error">{logic.error.message}</span>}
            </div>
          </fieldset>
          <div className="form-submit-container">
            <FormSubmitButton
              label="Sauvegarder"
              keyboardSubmit={{ isAvailable: true, key: "Enter" }}
              isLoading={logic.updateUserMutation.isLoading}
              formIsValid={!!(logic.name && logic.form.emailIsValid)}
            />
          </div>
        </form>
        <div className="modifyDialog-delete-container">
          <button className="modifyDialog-delete">Supprimer mon compte</button>
        </div>
      </div>
    </div>
  );
};

export default ModifyDialog;
