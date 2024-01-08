import { useLogin } from "./Login.logic";
import "../Form.css";
import Input from "../../../components/Input/Input";
import HidePassword from "../../../components/HidePassword/HidePassword";
import { Link } from "react-router-dom";
import InputError from "../../../components/InputError/InputError";
import FormHeader from "../../../components/FormHeader/FormHeader";
import FormSubmitButton from "../../../components/FormSubmitButton/FormSubmitButton";
import { getError } from "../../../utils/getError";
import FormValidation from "../../../components/EmailValidation/EmailValidation";

const Login = () => {
  const logic = useLogin();
  const formIsValid = !!(logic.email && logic.password && logic.form.emailIsValid);
  const { emailError, passwordError, unexcpectedError } = getError(logic.error?.code);

  return (
    <div className="form-container" style={{ minHeight: "500px" }}>
      <div className={logic.isLoading ? "form-content form-content-isLoading" : "form-content"}>
        <FormHeader title={"Se connecter"} subtitle={"Connectez-vous pour chatter avec n’importe qui, n’importe où !"} />
        <form className="form-form" onSubmit={logic.handleSubmitAsync}>
          <fieldset>
            <div>
              <Input
                type={{ otherValue: "text" }}
                id="email"
                placeholder="Email"
                value={logic.email}
                onChange={logic.handleInput}
                error={emailError}
              />
              <FormValidation isValid={logic.form.emailIsValid} />
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
              <InputError show={passwordError} error={logic.error} />
            </div>
          </fieldset>
          <div className="form-submit-container">
            <FormSubmitButton
              label="Se connecter"
              keyboardSubmit={{ isAvailable: true, key: "Enter" }}
              formIsValid={formIsValid}
              isLoading={logic.isLoading}
            />
          </div>
          <p className="form-redirection">
            Vous n'avez pas encore de compte ? <Link to="/register">C'est par ici !</Link>
          </p>
        </form>
      </div>
      <div className="form-error-container">
        <InputError show={unexcpectedError} error={logic.error} />
        <div className="form-error-phone">
          <InputError show={passwordError} error={logic.error} />
          <InputError show={emailError} error={logic.error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
