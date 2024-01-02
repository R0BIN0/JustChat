import { useRegister } from "./Register.logic";
import "../Form.css";
import { IErrorCode } from "../../../apis/IErrorCode";
import Input from "../../../components/Input/Input";
import EmailValidation from "../../../components/EmailValidation/EmailValidation";
import HidePassword from "../../../components/HidePassword/HidePassword";
import { Link } from "react-router-dom";
import InputError from "../../../components/InputError/InputError";
import FormHeader from "../../../components/FormHeader/FormHeader";
import FormSubmitButton from "../../../components/FormSubmitButton/FormSubmitButton";
import Avatar from "../../../components/Avatar/Avatar";

const Register = () => {
  const logic = useRegister();

  const { form, error } = logic.state;
  const formIsValid =
    logic.state.password &&
    logic.state.form.emailIsValid &&
    logic.state.name &&
    logic.state.password === logic.state.confirmPassword;

  const passwordError = error && error.code === IErrorCode.CANNOT_CONFIRM_PASSWORD;
  const emailError =
    (error && error.code === IErrorCode.SAME_EMAIL) || (error && error.code === IErrorCode.WRONG_MAIL_FORMAT);
  const nameError = error && error.code === IErrorCode.NAME_ALREADY_USED;
  const unexcpectedError =
    (error && error.code === IErrorCode.UNEXCPECTED_ERROR) ||
    (error && error.code === IErrorCode.CANNOT_CREATE_USER) ||
    passwordError;

  return (
    <div className="form-container" style={{ minHeight: "750px" }}>
      <div className={logic.mutation.isLoading ? "form-content form-content-isLoading" : "form-content"}>
        <FormHeader title={"S'enregistrer"} subtitle={"Profitez d'une expérience de chat simple et intuitive !"} />
        <div className="form-avatar-container">
          <Avatar handleAvatar={logic.handleAvatar} />
        </div>
        <form className="form-form" onSubmit={logic.handleSubmitAsync}>
          <fieldset>
            <div>
              <Input
                type={{ otherValue: "text" }}
                id="name"
                placeholder="Nom d'utilisateur"
                value={logic.state.name}
                onChange={logic.handleInput}
                error={!!nameError}
              />
              <EmailValidation isValid={!!logic.state.name} />
              <InputError show={!!nameError} error={logic.state.error} />
            </div>
            <div>
              <Input
                type={{ otherValue: "text" }}
                id="email"
                placeholder="Email"
                value={logic.state.email}
                onChange={logic.handleInput}
                error={!!emailError}
              />
              <EmailValidation isValid={logic.state.form.emailIsValid} />
              <InputError show={!!emailError} error={logic.state.error} />
            </div>
            <div>
              <Input
                type={{ originalValue: "password", condition: form.passwordIsHidden, otherValue: "text" }}
                id="password"
                placeholder="Mot de passe"
                value={logic.state.password}
                onChange={logic.handleInput}
                error={!!passwordError}
              />
              <HidePassword isHidden={logic.state.form.passwordIsHidden} onClick={logic.togglePassword} />
            </div>
            <div>
              <Input
                type={{ otherValue: "password" }}
                id="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={logic.state.confirmPassword}
                onChange={logic.handleInput}
                error={!!passwordError}
              />
            </div>
          </fieldset>
          <div className="form-submit-container">
            <FormSubmitButton
              label="S'enregistrer"
              keyboardSubmit={{ isAvailable: true, key: "Enter" }}
              formIsValid={!!formIsValid}
              isLoading={logic.mutation.isLoading}
            />
          </div>
          <p className="form-redirection">
            Vous avez déjà un compte ? <Link to="/">Connectez-vous !</Link>
          </p>
        </form>
      </div>
      <div className="form-error-container">
        <InputError show={!!unexcpectedError} error={logic.state.error} />
        <div className="form-error-phone">
          <InputError show={!!nameError} error={logic.state.error} />
          <InputError show={!!emailError} error={logic.state.error} />
        </div>
      </div>
    </div>
  );
};

export default Register;
