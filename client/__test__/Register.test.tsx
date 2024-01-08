import { render, renderHook, RenderHookResult, RenderResult, fireEvent, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IStore, initStore } from "../src/redux/store";
export const queryClient = new QueryClient();

import { Provider } from "react-redux";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

import React from "react";
import { act } from "react-dom/test-utils";
import axios from "axios";

import { vi as jest } from "vitest";
import Home from "../src/views/Home/Home";
import Register from "../src/views/Form/Register/Register";
import { useRegister } from "../src/views/Form/Register/Register.logic";
import { initialState } from "../src/views/Form/Register/Register.reducer";
import { register } from "../src/apis/actions/UserAction";
import Login from "../src/views/Form/Login/Login";
import { IErrorCode } from "../src/apis/IErrorCode";
import { IStatusCode } from "../src/apis/IStatusCode";
import { IUserDTO } from "../src/apis/IUserDTO";

let store: IStore;
export type IUseRegister = ReturnType<typeof useRegister>;
type IChildren = {
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
};

const initHook = (): RenderHookResult<IUseRegister, unknown> => {
  store = initStore();
  const wrapper = ({ children }: IChildren) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <MemoryRouter initialEntries={["/register"]}>
          <Register />
          {children}
        </MemoryRouter>
      </Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useRegister(), { wrapper });
};

const initComponent = (): RenderResult => {
  store = initStore();

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("Hook mount/unmount correctly", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;

  afterEach(() => hookResult.unmount());

  it("The hook is mounting without issue", () => {
    hookResult = initHook();
  });

  it("The initial state typeof of the hook is right", () => {
    hookResult = initHook();
    expect(typeof hookResult.result.current).toBe(typeof initialState);
  });

  it("The initial state values of the hook is right", () => {
    hookResult = initHook();
    expect(hookResult.result.current.name).toBe("");
    expect(hookResult.result.current.email).toBe("");
    expect(hookResult.result.current.password).toBe("");
    expect(hookResult.result.current.confirmPassword).toBe("");
    expect(hookResult.result.current.error).toBeUndefined();
    expect(hookResult.result.current.form).toStrictEqual({
      passwordIsHidden: true,
      emailIsValid: false,
    });
  });

  it("Verify that the hooks is unmouting correctly", () => {
    hookResult = initHook();
    hookResult.unmount();
  });

  it("Verify that the initial state is correctly cleaned after the hook is unmounted", () => {
    initialState.email = "test@gmail.com";
    hookResult = initHook();
    expect(hookResult.result.current.email).toBe("test@gmail.com");
    hookResult.unmount();
    expect(initialState.email).toBe("");
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

  it("Title corresponding to 'S'enregistrer'", () => {
    const title = document.querySelector("h1");
    expect(title).toBeInTheDocument();
    expect(title?.textContent).toBe("S'enregistrer");
  });
  it("Subtitle corresponding to 'Profitez d'une expérience de chat simple et intuitive !'", () => {
    const subtitle = document.querySelector("h2");
    expect(subtitle).toBeInTheDocument();
    expect(subtitle?.textContent).toBe("Profitez d'une expérience de chat simple et intuitive !");
  });
});

describe("Name input behaviors are working", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;
  let componentResult: RenderResult;

  afterEach(() => {
    hookResult?.unmount();
    componentResult?.unmount();
  });

  it("Verify if the input is present", () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    expect(nameInput).toBeInTheDocument();
  });

  it("The input is a child of a form", () => {
    componentResult = initComponent();
    const nameInpInForm = document.querySelector(".form-form #name");
    expect(nameInpInForm).toBeInTheDocument();
  });

  it("Verify if the name input is on 'text' type", () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    const type = nameInput?.getAttribute("type");
    expect(type).toBe("text");
  });

  it("Verify if the name input placeHolder is 'Nom d'utilisateur'", () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    const placeholder = nameInput.getAttribute("placeholder");
    expect(placeholder).toBe("Nom d'utilisateur");
  });

  it("Verify initial values of the input", () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    const value = nameInput.getAttribute("value");
    const content = nameInput.textContent;
    expect(value).toBe("");
    expect(content).toBe("");
  });

  it("Trigger the onChange is working", async () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    act(() => {
      fireEvent.change(nameInput, { target: { value: "Robin" } });
    });
    expect(nameInput?.getAttribute("value")).toBe("Robin");
  });

  it("If name is appropriate, Check if a green round with a 'Check' icon appeared", () => {
    componentResult = initComponent();
    const nameInput = document.querySelector("#name") as Element;
    act(() => {
      fireEvent.change(nameInput, { target: { value: "Robin" } });
    });
    const validationElement = [...document.querySelectorAll(".form-validation span")][0];
    const checkInconElement = document.querySelector(".form-validation span svg");
    expect(validationElement).toBeInTheDocument();
    expect(checkInconElement).toBeInTheDocument();
    const styles = window.getComputedStyle(validationElement!);
    expect(styles.backgroundColor).toBe("rgba(106, 255, 183, 0.153)");
  });
});

describe("Email input behaviors are working", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;
  let componentResult: RenderResult;

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
    const emailInpInForm = document.querySelector(".form-form #email");
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
    const validationElement = [...document.querySelectorAll(".form-validation span")][1];
    const checkInconElement = document.querySelector(".form-validation span svg");
    expect(validationElement).toBeInTheDocument();
    expect(checkInconElement).toBeInTheDocument();
    const styles = window.getComputedStyle(validationElement!);
    expect(styles.backgroundColor).toBe("rgba(106, 255, 183, 0.153)");
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
    validationElement = [...document.querySelectorAll(".form-validation span")][1];
    checkInconElement = document.querySelector(".form-validation span svg")!;
    expect(validationElement).toBeInTheDocument();
    expect(checkInconElement).toBeInTheDocument();
    styles = window.getComputedStyle(validationElement!);
    expect(styles.backgroundColor).toBe("rgba(106, 255, 183, 0.153)");
    act(() => {
      fireEvent.change(emailInput, { target: { value: "" } });
    });
    validationElement = [...document.querySelectorAll(".form-validation span")][1];
    checkInconElement = document.querySelector(".form-validation span svg")!;
    styles = window.getComputedStyle(validationElement!);
    expect(checkInconElement).not.toBeInTheDocument();
    expect(styles.backgroundColor).not.toBe("rgba(106, 255, 183, 0.153)");
  });
});

describe("Password input behaviors are working", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;
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
    const passwordInpInForm = document.querySelector(".form-form #password");
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
    expect(styles.fill).toBe("var(--CTA-color-hover)");
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
    expect(styles.fill).toBe("#64667c");
  });
  it("Press button to toggle hide password twice", () => {
    const showPasswordBtn = document.querySelector(".show-password")!;
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("text");
    fireEvent.click(showPasswordBtn);
    expect(passwordInput?.getAttribute("type")).toBe("password");
  });
});

describe("ConfirmPassword input behaviors are working", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;
  let confirmPasswordInput: Element | undefined;

  beforeEach(() => {
    hookResult = initHook();
    confirmPasswordInput = document.querySelector("#confirmPassword") as Element;
  });

  afterEach(() => {
    hookResult.unmount();
    confirmPasswordInput = undefined;
  });

  it("Verify if the input is present", () => {
    expect(confirmPasswordInput).toBeInTheDocument();
  });

  it("The input is a child of a form", () => {
    const confirmPasswordInpInForm = document.querySelector(".form-form #confirmPassword");
    expect(confirmPasswordInpInForm).toBeInTheDocument();
  });

  it("Password input type is 'password' by default", () => {
    const type = confirmPasswordInput?.getAttribute("type");
    expect(type).toBe("password");
  });

  it("Verify if the password input placeHolder is 'Confirmer le mot de passe'", () => {
    const placeholder = confirmPasswordInput?.getAttribute("placeholder");
    expect(placeholder).toBe("Confirmer le mot de passe");
  });

  it("Verify initial values of the input", () => {
    const value = confirmPasswordInput?.getAttribute("value");
    const content = confirmPasswordInput?.textContent;
    expect(value).toBe("");
    expect(content).toBe("");
  });

  it("Trigger the onChange is working", async () => {
    act(() => {
      if (!confirmPasswordInput) return;
      fireEvent.change(confirmPasswordInput, { target: { value: "azerty" } });
    });
    expect(confirmPasswordInput?.getAttribute("value")).toBe("azerty");
  });
});

describe("Submit button behavior are working", () => {
  let hookResult: RenderHookResult<IUseRegister, unknown>;
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
    const submitBtnInForm = document.querySelector(".form-form #submit");
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
    expect(submitBtnLabel.textContent).toBe("S'enregistrer");
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
  it("Submit button is lighter when all inputes are validated", () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    hookResult = initHook();
    const submitBtn = document.querySelector("#submit")!;
    const styles = window.getComputedStyle(submitBtn);
    expect(styles.opacity).toBe("1");
  });
  it("There is a label inside submit button called 'Enter'", () => {
    hookResult = initHook();
    const pressEnterLabel = document.querySelector("#submit .shortCut-keyboard-btn p");
    expect(pressEnterLabel).toBeInTheDocument();
    expect(pressEnterLabel?.textContent).toBe("Enter");
  });
  it("If a request is in progress, display a loader inside submit button", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    componentResult = initComponent();
    const submitBtn = document.querySelector("#submit")!;
    axios.post = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve({}), 1000)));
    fireEvent.click(submitBtn);
    const submitBtnLoader = await waitFor(() => componentResult.findByTestId("form-submit-loader"));
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
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initialState.form.emailIsValid = true;
    componentResult = initComponent();
    axios.post = jest.fn().mockImplementation(() => Promise.resolve({}));
    act(() => {
      fireEvent.keyPress(window, { key: "Enter", code: "Enter", charCode: 13 });
    });
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("Submit button click make a register request", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    hookResult = initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: {} };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.submit(btnSubmit);
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});

describe("Redirection to /login", () => {
  let componentResult: RenderResult;

  beforeEach(() => {
    componentResult = initComponent();
  });
  afterEach(() => {
    componentResult.unmount();
  });

  it("A text is present to go into '/Login' view", () => {
    const goToLoginLabel = document.querySelector(".form-redirection")!;
    expect(goToLoginLabel).toBeInTheDocument();
    expect(goToLoginLabel.textContent).toBe("Vous avez déjà un compte ? Connectez-vous !");
  });
  it("A link is present inside the text to go to '/Login' view", () => {
    const goToLoginLink = document.querySelector(".form-redirection a")!;
    expect(goToLoginLink).toBeInTheDocument();
    const href = goToLoginLink.getAttribute("href");
    expect(href).toBe("/");
  });
  it("When we click to the link we are redirected to '/Login' view", async () => {
    componentResult.unmount();
    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={["/register"]}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Login />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    const goToLoginLink = document.querySelector(".form-redirection a")!;
    expect(goToLoginLink).toBeInTheDocument();
    fireEvent.click(goToLoginLink);
    const registerViewTitle = document.querySelector(".formHeader-title-container h1");
    expect(registerViewTitle?.textContent).toBe("Se connecter");
    unmount();
  });
});

describe("Handle Register submit behavior", () => {
  let componentResult: RenderResult;
  let hookResult: RenderHookResult<IUseRegister, unknown>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    hookResult?.unmount();
    componentResult?.unmount();
  });

  it("Simulate success register request", async () => {
    const name = "Robin";
    const email = "test@gmail.com";
    const password = "azerty123";
    const confirmPassword = "azerty";
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    const data = await register({ name, email, password, confirmPassword });
    expect(data).toStrictEqual({ token: "TOKEN" });
  });

  it("Simulate bad register request", async () => {
    const name = "Robin";
    const email = "test@gmail.com";
    const password = "azerty123";
    const confirmPassword = "azerty";
    const mockedResponse = new Error("Unexpected Error !");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    await expect(register({ name, email, password, confirmPassword })).rejects.toThrow(
      "Une erreur est survenue. Veuillez réessayer ultérieurement."
    );
  });

  it("If the reponse is good from the server. Dispatch infos to store", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedUser: IUserDTO = {
      name: "Robin",
      email: "test@gmail.com",
      pictureId: 1,
      online: true,
      _id: "ABC",
    };
    const mockedResponse = { data: { token: "TOKEN", user: mockedUser } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const { isAuthenticated, token } = store.getState().auth;
    expect(isAuthenticated).toBeTruthy();
    expect(token).toStrictEqual("TOKEN");
    const user = store.getState().user;
    expect(user).toStrictEqual(mockedUser);
  });

  it("If the reponse is good from the server. The user is redirected to '/Home' path", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <MemoryRouter initialEntries={["/register"]}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      </QueryClientProvider>
    );

    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: { token: "TOKEN", user: { name: "Robin", email: "test@gmail.com" } } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    expect(screen.getByText("Discuter avec tout le monde !")).toBeInTheDocument();
    unmount();
  });
  it("If the reponse is wrong from the server. Dispatch infos to store", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
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
    const user = store.getState().user;
    expect(user.name).toBe("");
    expect(user.email).toBe("");
  });

  it("If we received an Unexpected error from the server. Display an error message", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = new Error("Server crashed");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    screen.getByText("Une erreur est survenue. Veuillez réessayer ultérieurement.");
  });

  it("If a player with this name already exist. Send an appropriate error message", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      response: {
        data: {
          error: {
            message: "This name is already used",
            code: IErrorCode.NAME_ALREADY_USED,
            status: IStatusCode.BAD_REQUEST,
          },
        },
      },
    };
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const errorEl = document.querySelector(".form-form .input-error");
    expect(errorEl?.textContent).toBe("Ce nom d'utilisateur est déjà utilisé.");
  });

  it("If a player with this email already exist. Send an appropriate error message", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      response: {
        data: {
          error: {
            message: "A User with this email already exist",
            code: IErrorCode.SAME_EMAIL,
            status: IStatusCode.BAD_REQUEST,
          },
        },
      },
    };
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const errorEl = document.querySelector(".form-form .input-error");
    expect(errorEl?.textContent).toBe("Cet email est déjà utilisé.");
  });

  it("If password and confirm password are not the same. Send an appropriate error message", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      response: {
        data: {
          error: {
            message: "Not able to confirm password",
            code: IErrorCode.CANNOT_CONFIRM_PASSWORD,
            status: IStatusCode.BAD_REQUEST,
          },
        },
      },
    };
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const errorEl = document.querySelector(".input-error");
    expect(errorEl?.textContent).toBe("La confirmation de vos mots de passe est invalide.");
  });

  it("If the server cannot create User. Send an appropriate error message", async () => {
    initialState.name = "Robin";
    initialState.email = "test@gmail.com";
    initialState.password = "azerty";
    initialState.confirmPassword = "azerty";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = {
      response: {
        data: {
          error: {
            message: "Not able to create User",
            code: IErrorCode.CANNOT_CREATE_USER,
            status: IStatusCode.BAD_REQUEST,
          },
        },
      },
    };
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    const errorEl = document.querySelector(".input-error");
    expect(errorEl?.textContent).toBe("Impossible de créer l'utilisateur. Veuillez réessayer plus tard.");
  });
});
