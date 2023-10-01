import { render, renderHook, RenderHookResult, RenderResult, fireEvent, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import store from "../src/redux/store";
export const queryClient = new QueryClient();

import { Provider } from "react-redux";
import Login from "../src/views/Login/Login";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { useLogin } from "../src/views/Login/Login.logic";
import { IState, initialState } from "../src/views/Login/Login.reducer";
import React from "react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import { login } from "../src/apis/actions/UserAction";
import { vi as jest } from "vitest";
import { createMemoryHistory } from "history";
import Home from "../src/views/Home/Home";
import Register from "../src/views/Register/Register";
import { IErrorCode } from "../src/apis/IErrorCode";
import { IStatusCode } from "../src/apis/IStatusCode";

export type IUseLogin = ReturnType<typeof useLogin>;
type IChildren = {
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
};

const initHook = (): RenderHookResult<IUseLogin, unknown> => {
  const wrapper = ({ children }: IChildren) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Login />
          {children}
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useLogin(), { wrapper });
};

const initComponent = (): RenderResult =>
  render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );

describe("Hook mount/unmount correctly", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;

  afterEach(() => hookResult.unmount());

  it("The hook is mounting without issue", () => {
    hookResult = initHook();
  });

  it("The initial state typeof of the hook is right", () => {
    hookResult = initHook();
    expect(typeof hookResult.result.current.state).toBe(typeof initialState);
  });

  it("The initial state values of the hook is right", () => {
    hookResult = initHook();
    expect(hookResult.result.current.state).toEqual({
      email: "",
      password: "",
      error: undefined,
      form: {
        passwordIsHidden: true,
        emailIsValid: false,
      },
    });
  });

  it("Verify that the hooks is unmouting correctly", () => {
    hookResult = initHook();
    hookResult.unmount();
  });

  it("Verify that the initial state is correctly cleaned after the hook is unmounted", () => {
    initialState.email = "test@gmail.com";
    hookResult = initHook();
    expect(hookResult.result.current.state.email).toBe("test@gmail.com");
    hookResult.unmount();
    const expectedResponse: IState = {
      email: "",
      password: "",
      error: undefined,
      form: { passwordIsHidden: true, emailIsValid: false },
    };
    expect(initialState).toStrictEqual(expectedResponse);
  });
});

describe("Component mount/unmount correctly", () => {
  let componentResult: RenderResult;

  afterEach(() => {
    componentResult.unmount();
  });

  it("Verify if the component mount", () => {
    componentResult = initComponent();
  });

  it("Verify if the component unmount", () => {
    componentResult = initComponent();
    componentResult.unmount();
  });
});

describe("Global page elements are good", () => {
  let componentResult: RenderResult;

  beforeEach(() => (componentResult = initComponent()));
  afterEach(() => componentResult.unmount());

  it("Title corresponding to 'Se connecter'", () => {
    const title = document.querySelector("h1");
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe("Se connecter");
  });
  it("Subtitle corresponding to 'Connectez-vous pour chatter avec n’importe qui, n’importe où !'", () => {
    const subtitle = document.querySelector("h2");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle?.textContent).toBe("Connectez-vous pour chatter avec n’importe qui, n’importe où !");
  });
});

describe("Email input behavior are working", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;
  let componentResult: RenderResult;

  beforeEach(() => {});

  afterEach(() => {
    hookResult?.unmount();
    componentResult?.unmount();
  });

  it("Verify if the input is present", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    expect(emailInput).toBeInTheDocument();
  });

  it("The input is a child of a form", () => {
    componentResult = initComponent();
    const emailInpInForm = document.querySelector(".login-form #email");
    expect(emailInpInForm).toBeInTheDocument();
  });

  it("Verify if the email input is on 'text' type", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    const type = emailInput?.getAttribute("type");
    expect(type).toBe("text");
  });

  it("Verify if the email input placeHolder is 'Email'", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    const placeholder = emailInput.getAttribute("placeholder");
    expect(placeholder).toBe("Email");
  });

  it("Verify initial values of the input", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    const value = emailInput.getAttribute("value");
    const content = emailInput.textContent;
    expect(value).toBe("");
    expect(content).toBe("");
  });

  it("Trigger the onChange is working", async () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    act(() => {
      fireEvent.change(emailInput, { target: { value: "Hello" } });
    });
    expect(emailInput?.getAttribute("value")).toBe("Hello");
  });
  it("If email is appropriate, Check if a green round with a 'Check' icon appeared", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;

    act(() => {
      fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    });
    const validationElement = document.querySelector(".email-validation span");
    const checkInconElement = document.querySelector(".email-validation span svg");
    expect(validationElement).toBeInTheDocument();
    expect(checkInconElement).toBeInTheDocument();
    const styles = window.getComputedStyle(validationElement!);
    expect(styles.backgroundColor).toBe("rgb(106, 255, 184)");
  });
  it("If email is appropriate, toggle 'emailIsValid' state to true, then modify email to not be valid", () => {
    componentResult = initComponent();
    const emailInput = document.querySelector("#email") as Element;
    let validationElement: Element;
    let checkInconElement: Element;
    let styles: CSSStyleDeclaration;
    act(() => {
      fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    });
    validationElement = document.querySelector(".email-validation span")!;
    checkInconElement = document.querySelector(".email-validation span svg")!;
    expect(validationElement).toBeInTheDocument();
    expect(checkInconElement).toBeInTheDocument();
    styles = window.getComputedStyle(validationElement!);
    expect(styles.backgroundColor).toBe("rgb(106, 255, 184)");
    act(() => {
      fireEvent.change(emailInput, { target: { value: "" } });
    });
    validationElement = document.querySelector(".email-validation span")!;
    checkInconElement = document.querySelector(".email-validation span svg")!;
    styles = window.getComputedStyle(validationElement!);

    expect(checkInconElement).not.toBeInTheDocument();
    expect(styles.backgroundColor).not.toBe("rgb(106, 255, 184)");
  });
});

describe("Password input behavior are working", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;
  let passwordInput: Element | undefined;

  beforeEach(() => {
    hookResult = initHook();
    passwordInput = document.querySelector("#password") as Element;
  });

  afterEach(() => {
    hookResult.unmount();
    passwordInput = undefined;
  });

  it("Verify if the input is present", () => {
    expect(passwordInput).toBeInTheDocument();
  });

  it("The input is a child of a form", () => {
    const passwordInpInForm = document.querySelector(".login-form #password");
    expect(passwordInpInForm).toBeInTheDocument();
  });

  it("Password input type is 'password' by default", () => {
    const type = passwordInput?.getAttribute("type");
    expect(type).toBe("password");
  });

  it("Verify if the password input placeHolder is 'Mot de passe'", () => {
    const placeholder = passwordInput?.getAttribute("placeholder");
    expect(placeholder).toBe("Mot de passe");
  });

  it("Verify initial values of the input", () => {
    const value = passwordInput?.getAttribute("value");
    const content = passwordInput?.textContent;
    expect(value).toBe("");
    expect(content).toBe("");
  });

  it("Trigger the onChange is working", async () => {
    act(() => {
      if (!passwordInput) return;
      fireEvent.change(passwordInput, { target: { value: "Hello" } });
    });
    expect(passwordInput?.getAttribute("value")).toBe("Hello");
  });

  it("Button to toggle hide password is present", () => {
    const showPasswordBtn = document.querySelector(".show-password");
    expect(showPasswordBtn).toBeInTheDocument();
  });
  it("Button to toggle hide password has yellow icon by default", () => {
    const showPasswordBtnIcon = document.querySelector(".show-password svg path");
    expect(showPasswordBtnIcon).toBeInTheDocument();
    const styles = window.getComputedStyle(showPasswordBtnIcon!);
    expect(styles.fill).toBe("var(--CTA-color)");
  });
  it("Press button to toggle hide password and verify that password input type has been changed into 'text'", () => {
    const showPasswordBtn = document.querySelector(".show-password")!;
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("text");
  });
  it("Press button to toggle hide password and verify that icon is grey", () => {
    const showPasswordBtn = document.querySelector(".show-password")!;
    const showPasswordBtnIcon = document.querySelector(".show-password svg path");
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("text");
    const styles = window.getComputedStyle(showPasswordBtnIcon!);
    expect(styles.fill).toBe("var(--secondary-color)");
  });
  it("Press button to toggle hide password twice", () => {
    const showPasswordBtn = document.querySelector(".show-password")!;
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("text");
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("password");
  });
});

describe("Submit button behavior are working", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;
  let componentResult: RenderResult;

  afterEach(() => {
    hookResult?.unmount();
    componentResult?.unmount();
  });

  it("Submit button is present", () => {
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit") as Element;
    expect(submitBtn).toBeInTheDocument();
  });
  it("The button is a child of a form", () => {
    hookResult = initHook();
    const submitBtnInForm = document.querySelector(".login-form #submit");
    expect(submitBtnInForm).toBeInTheDocument();
  });

  it("The submit button has 'submit' as type attribute", () => {
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit") as Element;
    const type = submitBtn?.getAttribute("type");
    expect(type).toBe("submit");
  });

  it("Submit button label is good", () => {
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit") as Element;
    expect(submitBtn).toBeInTheDocument();
    const submitBtnLabel = document.querySelector("#submit p") as Element;
    expect(submitBtnLabel).toBeInTheDocument();
    expect(submitBtnLabel.textContent).toBe("Se connecter");
  });

  it("Submit button is darker by default", () => {
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit") as Element;
    const styles = window.getComputedStyle(submitBtn);
    expect(styles.opacity).toBe("0.5");
  });
  it("Click to submit button when inputs are not validate is doing nothing", async () => {
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit")!;
    axios.post = jest.fn().mockImplementation(() => Promise.resolve({}));
    act(() => {
      fireEvent.click(submitBtn);
    });
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(0);
  });
  it("Submit button is lighter when both input are validated", () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit")!;
    const styles = window.getComputedStyle(submitBtn);
    expect(styles.opacity).toBe("1");
  });
  it("There is a label inside submit button called 'Enter'", () => {
    hookResult = initHook();
    const pressEnterLabel = document.querySelector("#submit .login-press-enter-btn p");
    expect(pressEnterLabel).toBeInTheDocument();
    expect(pressEnterLabel?.textContent).toBe("Enter");
  });
  it("If a request is in progress, display a loader inside submit button", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    componentResult = initComponent();
    const submitBtn = document.querySelector("#submit")!;
    axios.post = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({}), 1000)));
    fireEvent.click(submitBtn);
    const submitBtnLoader = await waitFor(() => componentResult.findByTestId("login-submit-loader"));
    expect(submitBtnLoader).toBeInTheDocument();
  });

  it("Press 'Enter' keyboard button when inputs are not validate do nothing", async () => {
    componentResult = initComponent();
    axios.post = jest.fn().mockImplementation(() => Promise.resolve({}));
    act(() => {
      fireEvent.keyPress(window, { key: "Enter", code: "Enter", charCode: 13 });
    });
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(0);
  });

  it("Press 'Enter' keyboard button when inputs validate send a request", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.form.emailIsValid = true;
    componentResult = initComponent();
    axios.post = jest.fn().mockImplementation(() => Promise.resolve({}));
    act(() => {
      fireEvent.keyPress(window, { key: "Enter", code: "Enter", charCode: 13 });
    });
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("Submit button click make a login request", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    hookResult = initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.submit(btnSubmit);
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});

describe("Redirection to /register", () => {
  let componentResult: RenderResult;

  beforeEach(() => {
    componentResult = initComponent();
  });
  afterEach(() => {
    componentResult.unmount();
  });

  it("A text is present to go into '/Register' view", () => {
    const goToRegisterLabel = document.querySelector(".login-no-account")!;
    expect(goToRegisterLabel).toBeInTheDocument();
    expect(goToRegisterLabel.textContent).toBe("Vous n'avez pas encore de compte ? C'est par ici !");
  });
  it("A link is present inside the text to go to '/Register' view", () => {
    const goToRegisterLink = document.querySelector(".login-no-account a")!;
    expect(goToRegisterLink).toBeInTheDocument();
    const href = goToRegisterLink.getAttribute("href");
    expect(href).toBe("/register");
  });
  it("When we click to the link we are redirected to '/Register' view", async () => {
    componentResult.unmount();
    const history = createMemoryHistory();
    expect(history.location.pathname).toBe("/");

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    const goToRegisterLink = document.querySelector(".login-no-account a")!;
    expect(goToRegisterLink).toBeInTheDocument();
    fireEvent.click(goToRegisterLink);
    expect(screen.getByText("Register")).toBeInTheDocument();
    unmount();
  });
});

describe("Handle Login submit behavior", () => {
  let componentResult: RenderResult;
  let hookResult: RenderHookResult<IUseLogin, unknown>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    hookResult?.unmount();
    componentResult?.unmount();
  });

  it("Simulate success login request", async () => {
    const email = "test@gmail.com";
    const password = "azerty123";
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    const data = await login({ email, password });
    expect(data).toStrictEqual({ token: "TOKEN" });
  });

  it("Simulate bad login request", async () => {
    const email = "";
    const password = "";
    const mockedResponse = new Error("Unexpected Error !");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    await expect(login({ email, password })).rejects.toThrow(
      "Une erreur est survenue. Veuillez réessayer ultérieurement."
    );
  });

  it("If the reponse is good from the server. Dispatch infos to store", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const { isAuthenticated, token } = store.getState().auth;
    expect(isAuthenticated).toBeTruthy();
    expect(token).toStrictEqual("TOKEN");
  });

  it("If the reponse is good from the server. The user is redirected to '/Home' path", async () => {
    const history = createMemoryHistory();
    expect(history.location.pathname).toBe("/");
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={["/"]}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    expect(screen.getByText("Home")).toBeInTheDocument();
    unmount();
  });
  it("If the reponse is wrong from the server. Dispatch infos to store", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      data: { error: { message: "Something went wrong" } },
      status: 404,
    };

    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const { isAuthenticated, token } = store.getState().auth;
    expect(isAuthenticated).toBeFalsy();
    expect(token).toBeUndefined();
  });
  it("If we received an Unexpected error from the server. Display an error message", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = new Error("Server crashed");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    screen.getByText("Une erreur est survenue. Veuillez réessayer ultérieurement.");
  });

  it("If no user was found from the server, display an appropriate message", async () => {
    initialState.email = "noUserExistWithThisEmail@gmail.com";
    initialState.password = "azerty123";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      response: {
        data: {
          error: {
            message: "No User found",
            code: IErrorCode.USER_NOT_FOUND,
            status: IStatusCode.NOT_FOUND,
          },
        },
      },
    };
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    screen.getByText("Adresse mail incorrect.");
  });
});

it("If password is wrong, display an appropriate message", async () => {
  initialState.email = "test@gmail.com";
  initialState.password = "wrong_password";
  initHook();
  const btnSubmit = document.querySelector("#submit") as Element;
  const mockedResponse = {
    response: {
      data: {
        error: {
          message: "Password is invalid",
          code: IErrorCode.INVALID_PASSWORD,
          status: IStatusCode.BAD_REQUEST,
        },
      },
    },
  };
  axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
  fireEvent.click(btnSubmit);
  await waitFor(() => {});
  screen.getByText("Mot de passe incorrect.");
});
