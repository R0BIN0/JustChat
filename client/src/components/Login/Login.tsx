import { useLogin } from "./Login.logic";

const Login = () => {
    const logic = useLogin();

    if (logic.mutation.isError) {
        return <p>Une erreur est survenue</p>;
    }

    if (logic.mutation.isLoading) {
        return <p>Chargement..</p>;
    }

    return (
        <div>
            <p>Login</p>
            <input
                type="text"
                id="email"
                value={logic.state.email}
                onChange={(e) => logic.handleInput(e)}
            />
            <input
                type="password"
                id="password"
                value={logic.state.password}
                onChange={(e) => logic.handleInput(e)}
            />
            <button onClick={() => logic.handleSubmitAsync()}>BOUTON</button>
        </div>
    );
};

export default Login;
