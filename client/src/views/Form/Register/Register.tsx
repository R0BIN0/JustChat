import { useRegister } from "./Register.logic";
import "../Form.css";
import Input from "../../../components/Input/Input";
import EmailValidation from "../../../components/EmailValidation/EmailValidation";
import HidePassword from "../../../components/HidePassword/HidePassword";
import { Link } from "react-router-dom";
import InputError from "../../../components/InputError/InputError";
import FormHeader from "../../../components/FormHeader/FormHeader";
import FormSubmitButton from "../../../components/FormSubmitButton/FormSubmitButton";
import Avatar from "../../../components/Avatar/Avatar";
import { getError } from "../../../utils/getError";

const Register = () => {
  const logic = useRegister();
  const formIsValid = logic.password && logic.form.emailIsValid && logic.name && logic.password === logic.confirmPassword;
  const { nameError, emailError, passwordError, unexcpectedError } = getError(logic.error?.code);

  return (
    <div className="form-container" style={{ minHeight: "750px" }}>
      <div className={logic.isLoading ? "form-content form-content-isLoading" : "form-content"}>
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
                value={logic.name}
                onChange={logic.handleInput}
                error={nameError}
              />
              <EmailValidation isValid={!!logic.name} />
              <InputError show={nameError} error={logic.error} />
            </div>
            <div>
              <Input
                type={{ otherValue: "text" }}
                id="email"
                placeholder="Email"
                value={logic.email}
                onChange={logic.handleInput}
                error={emailError}
              />
              <EmailValidation isValid={logic.form.emailIsValid} />
              <InputError show={emailError} error={logic.error} />
            </div>
            <div>
              <Input
                type={{ originalValue: "password", condition: logic.form.passwordIsHidden, otherValue: "text" }}
                id="password"
                placeholder="Mot de passe"
                value={logic.password}
                onChange={logic.handleInput}
                error={passwordError}
              />
              <HidePassword isHidden={logic.form.passwordIsHidden} onClick={logic.togglePassword} />
            </div>
            <div>
              <Input
                type={{ otherValue: "password" }}
                id="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={logic.confirmPassword}
                onChange={logic.handleInput}
                error={passwordError}
              />
            </div>
          </fieldset>
          <div className="form-submit-container">
            <FormSubmitButton
              label="S'enregistrer"
              keyboardSubmit={{ isAvailable: true, key: "Enter" }}
              formIsValid={!!formIsValid}
              isLoading={logic.isLoading}
            />
          </div>
          <p className="form-redirection">
            Vous avez déjà un compte ? <Link to="/">Connectez-vous !</Link>
          </p>
        </form>
      </div>
      <div className="form-error-container">
        <InputError show={unexcpectedError} error={logic.error} />
        <div className="form-error-phone">
          <InputError show={nameError} error={logic.error} />
          <InputError show={emailError} error={logic.error} />
        </div>
      </div>
    </div>
  );
};

export default Register;
