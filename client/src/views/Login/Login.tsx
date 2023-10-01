import { useLogin } from "./Login.logic";
import "./Login.css";
import { IErrorCode } from "../../apis/IErrorCode";
import Input from "../../components/Input/Input";
import EmailValidation from "../../components/EmailValidation/EmailValidation";
import HidePassword from "../../components/HidePassword/HidePassword";

const Login = () => {
  const logic = useLogin();

  const { form, error } = logic.state;
  const formIsValid = Boolean(logic.state.email && logic.state.password && logic.state.form.emailIsValid);
  const passwordError = error && error.code === IErrorCode.INVALID_PASSWORD;
  const emailError = error && error.code === IErrorCode.USER_NOT_FOUND;
  const isUnexcpectedError = error && error.code === IErrorCode.UNEXCPECTED_ERROR;

  return (
    <div className="login-container">
      <div className={logic.mutation.isLoading ? "login-content login-content-isLoading" : "login-content"}>
        <div className="login-title-container">
          <h1>Se connecter</h1>
          <h2>Connectez-vous pour chatter avec n’importe qui, n’importe où !</h2>
        </div>
        <form className="login-form" onSubmit={logic.handleSubmitAsync}>
          <fieldset>
            <div data-has-error={Boolean(emailError)}>
              <Input
                type={{ otherValue: "text" }}
                id="email"
                placeholder="Email"
                value={logic.state.email}
                onChange={logic.handleInput}
                error={Boolean(emailError)}
              />
              <EmailValidation isValid={logic.state.form.emailIsValid} />

              {emailError && <p>Adresse mail introuvable</p>}
            </div>
            <div data-has-error={Boolean(passwordError)}>
              <Input
                type={{ originalValue: "password", condition: form.passwordIsHidden, otherValue: "text" }}
                id="password"
                placeholder="Mot de passe"
                value={logic.state.password}
                onChange={logic.handleInput}
                error={Boolean(passwordError)}
              />
              <HidePassword isHidden={logic.state.form.passwordIsHidden} onClick={logic.togglePassword} />
              {passwordError && <p>Mot de passe incorrecte</p>}
            </div>
          </fieldset>
          <div className="login-submit-container">
            <button id="submit" type="submit" data-form-validity={formIsValid}>
              {logic.mutation.isLoading ? (
                <div className="login-submit-loader"></div>
              ) : (
                <>
                  <p>Se connecter</p>
                  <div className="login-press-enter-btn">
                    <div></div>
                    <div></div>
                    <p>Enter</p>
                  </div>
                </>
              )}
            </button>
          </div>
          <p className="login-no-account">
            Vous n'avez pas encore de compte ? <a href="/register">C'est par ici !</a>
          </p>
          <div className="login-errors-container">
            {isUnexcpectedError && (
              <p className="login-unexcpected-error" data-unexcpected-error={true}>
                {error.message}
              </p>
            )}

            {(passwordError || emailError) && (
              <p className="login-error-message" data-has-error={true}>
                {error.message}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
