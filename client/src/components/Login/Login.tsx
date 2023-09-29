import { useLogin } from "./Login.logic";

const Login = () => {
  const logic = useLogin();

  if (logic.mutation.isError) {
    return <p>{logic.state.error.message}</p>;
  }

  if (logic.mutation.isLoading) {
    return <p>Chargement..</p>;
  }

  return (
    <div>
      <p>Login</p>

      <form className="login-form" onSubmit={logic.handleSubmitAsync}>
        <fieldset>
          <p>
            <input
              type="text"
              id="email"
              placeholder="Email"
              value={logic.state.email}
              onChange={(e) => logic.handleInput(e)}
            />
            <label htmlFor="email">Email</label>
          </p>
          <p>
            <input
              type="password"
              id="password"
              placeholder="Mot de passe"
              value={logic.state.password}
              onChange={(e) => logic.handleInput(e)}
            />
            <label data-testid="password-label" htmlFor="password">
              Mot de passe
            </label>
          </p>

          <button id="submit" type="submit">
            Se Connecter
          </button>
        </fieldset>
      </form>
    </div>
  );
};

export default Login;
