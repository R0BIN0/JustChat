import { render, renderHook, RenderHookResult, RenderResult, fireEvent, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import store from "../src/redux/store";
export const queryClient = new QueryClient();

import { Provider } from "react-redux";
import Login from "../src/components/Login/Login";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import { useLogin } from "../src/components/Login/Login.logic";
import { initialState } from "../src/components/Login/Login.reducer";
import React from "react";
import { act } from "react-dom/test-utils";
import axios from "axios";
import { login } from "../src/apis/actions/UserAction";
import { vi as jest } from "vitest";
import { createMemoryHistory } from "history";
import Home from "../src/components/Home/Home";

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
      error: {
        message: "",
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

describe("Email input behavior are working", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;
  let emailInput: Element | undefined;

  beforeEach(() => {
    hookResult = initHook();
    emailInput = document.querySelector("#email") as Element;
  });

  afterEach(() => {
    hookResult.unmount();
    emailInput = undefined;
  });

  it("Verify if the input is present", () => {
    expect(emailInput).toBeInTheDocument();
  });

  it("The input is a child of a form", () => {
    const emailInpInForm = document.querySelector(".login-form #email");
    expect(emailInpInForm).toBeInTheDocument();
  });

  it("The input has a corresponding label", () => {
    const emailLabel = screen.getByText("Email");
    expect(emailLabel).toBeInTheDocument();
    const htmlFor = emailLabel.getAttribute("for");
    expect(htmlFor).toBe("email");
  });

  it("Verify if the email input is on 'text' type", () => {
    const type = emailInput?.getAttribute("type");
    expect(type).toBe("text");
  });

  it("Verify if the email input placeHolder is 'Email'", () => {
    const placeholder = emailInput?.getAttribute("placeholder");
    expect(placeholder).toBe("Email");
  });

  it("Verify initial values of the input", () => {
    const value = emailInput?.getAttribute("value");
    const content = emailInput?.textContent;
    expect(value).toBe("");
    expect(content).toBe("");
  });

  it("Trigger the onChange is working", async () => {
    act(() => {
      if (!emailInput) return;
      fireEvent.change(emailInput, { target: { value: "Hello" } });
    });
    expect(emailInput?.getAttribute("value")).toBe("Hello");
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

  it("The input has a corresponding label", () => {
    const passwordLabel = screen.getByText("Mot de passe");
    expect(passwordLabel).toBeInTheDocument();
    const htmlFor = passwordLabel.getAttribute("for");
    expect(htmlFor).toBe("password");
  });

  it("Verify if the password input is on 'password' type", () => {
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
});

describe("Submit button behavior are working", () => {
  let hookResult: RenderHookResult<IUseLogin, unknown>;
  let submitBtn: Element | undefined;

  beforeEach(() => {
    hookResult = initHook();
    submitBtn = document.querySelector("#submit") as Element;
  });

  afterEach(() => {
    hookResult?.unmount();
    submitBtn = undefined;
  });

  it("Submit button is present", () => {
    expect(submitBtn).toBeInTheDocument();
  });
  it("The button is a child of a form", () => {
    const submitBtnInForm = document.querySelector(".login-form #submit");
    expect(submitBtnInForm).toBeInTheDocument();
  });

  it("The submit button has 'submit' as type attribute", () => {
    const type = submitBtn?.getAttribute("type");
    expect(type).toBe("submit");
  });

  it("Submit button label is good", () => {
    expect(submitBtn?.textContent).toBe("Se Connecter");
  });

  it("Submit button click make a login request", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    hookResult = initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = { data: { token: "TOKEN" } };
    axios.post = jest.fn().mockImplementation(() => Promise.resolve(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    expect(axios.post).toHaveBeenCalledTimes(1);
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
    const mockedResponse = new Error("API FAIL");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    await expect(login({ email, password })).rejects.toThrow("API FAIL");
  });

  it("Do not fill 'email' input should display an appropriate error", () => {});
  it("Do not fill 'password' input should display an appropriate error", () => {});
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
              <Route path="/Home" element={<Home />} />
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
  it("If the response is wrong from the server. Display an error message", async () => {
    initialState.email = "test@gmail.com";
    initialState.password = "azerty123";
    initHook();
    const btnSubmit = document.querySelector("#submit") as Element;
    const mockedResponse = new Error("API FAIL");
    axios.post = jest.fn().mockImplementation(() => Promise.reject(mockedResponse));
    fireEvent.click(btnSubmit);
    await waitFor(() => {});
    screen.getByText("API FAIL");
  });
});
