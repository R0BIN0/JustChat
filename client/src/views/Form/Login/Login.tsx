import { useLogin } from "./Login.logic";

import "../Form.css";
import { IErrorCode } from "../../../apis/IErrorCode";
import Input from "../../../components/Input/Input";
import EmailValidation from "../../../components/EmailValidation/EmailValidation";
import HidePassword from "../../../components/HidePassword/HidePassword";
import { Link } from "react-router-dom";
import InputError from "../../../components/InputError/InputError";
import FormHeader from "../../../components/FormHeader/FormHeader";
import FormSubmitButton from "../../../components/FormSubmitButton/FormSubmitButton";

const Login = () => {
  const logic = useLogin();

  const { form, error } = logic.state;
  const formIsValid = logic.state.email && logic.state.password && logic.state.form.emailIsValid;
  const passwordError = error && error.code === IErrorCode.INVALID_PASSWORD;
  const emailError = error && error.code === IErrorCode.USER_NOT_FOUND;
  const unexcpectedError = error && error.code === IErrorCode.UNEXCPECTED_ERROR;

  return (
    <div className="form-container" style={{ minHeight: "500px" }}>
      <div className={logic.mutation.isLoading ? "form-content form-content-isLoading" : "form-content"}>
        <FormHeader
          title={"Se connecter"}
          subtitle={"Connectez-vous pour chatter avec n’importe qui, n’importe où !"}
        />
        <form className="form-form" onSubmit={logic.handleSubmitAsync}>
          <fieldset>
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
              <InputError show={!!passwordError} error={logic.state.error} />
            </div>
          </fieldset>
          <div className="form-submit-container">
            <FormSubmitButton
              label="Se connecter"
              keyboardSubmit={{ isAvailable: true, key: "Enter" }}
              formIsValid={!!formIsValid}
              isLoading={logic.mutation.isLoading}
            />
          </div>
          <p className="form-redirection">
            Vous n'avez pas encore de compte ? <Link to="/register">C'est par ici !</Link>
          </p>
        </form>
      </div>
      <div className="form-error-container">
        <InputError show={!!unexcpectedError} error={logic.state.error} />
        <div className="form-error-phone">
          <InputError show={!!passwordError} error={logic.state.error} />
          <InputError show={!!emailError} error={logic.state.error} />
        </div>
      </div>
    </div>
  );
};

export default Login;
