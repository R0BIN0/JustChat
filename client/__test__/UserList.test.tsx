import { render, renderHook, RenderHookResult, RenderResult, waitFor, screen } from "@testing-library/react";
import { IStore, initStore } from "../src/redux/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { vi as jest } from "vitest";

import UserList from "../src/components/UserList/UserList";
import { useUserList } from "../src/components/UserList/UserList.logic";
import { IUser } from "../src/apis/IUser";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { initialState, IState } from "../src/components/UserList/UserList.reducer";
import { setUser } from "../src/redux/reducers/userReducer";

export const queryClient = new QueryClient();

let store: IStore;
export type IUseUserList = ReturnType<typeof useUserList>;
type IChildren = {
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
};

const props = {
  handleError: jest.fn(),
  onRef: jest.fn(),
  toggleIsLoaded: jest.fn(),
};

jest.mock("../src/apis/actions/UserAction", () => ({
  getAllUsers: jest.fn(),
}));

const buildUser = (idx: number, isDisconnected?: boolean): Omit<IUser, "password"> => {
  return {
    name: `User${idx}`,
    email: `user${idx}@example.com`,
    online: isDisconnected === undefined,
    _id: String(idx),
    pictureId: idx,
  };
};

const generateMockedUser = (count: number, isDisconnected?: boolean) => {
  const users: Omit<IUser, "password">[] = [];
  for (let i = 1; i <= count; i++) {
    users.push(buildUser(i, isDisconnected));
  }
  return users;
};

const initHook = (): RenderHookResult<IUseUserList, unknown> => {
  store = initStore();
  const wrapper = ({ children }: IChildren) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    </QueryClientProvider>
  );

  return renderHook(() => useUserList(props), { wrapper });
};

const initComponent = (): RenderResult => {
  store = initStore();
  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <UserList {...props} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("Hook mount/unmount correctly", () => {
  let hookResult: RenderHookResult<IUseUserList, unknown>;

  beforeEach(() => {
    jest.restoreAllMocks();
    axios.get = jest.fn();
  });

  afterEach(() => {
    hookResult.unmount();
  });

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
      users: [],
      search: "",
    });
  });

  it("Verify that the hooks is unmouting correctly", () => {
    hookResult = initHook();
    hookResult.unmount();
  });

  it("Verify that the initial state is correctly cleaned after the hook is unmounted", () => {
    initialState.users = generateMockedUser(1);
    initialState.search = "search";
    hookResult = initHook();
    expect(hookResult.result.current.state.search).toBe("search");
    hookResult.unmount();
    const expectedResponse: IState = {
      users: [],
      search: "",
    };
    expect(initialState).toStrictEqual(expectedResponse);
  });
});

describe("Component mount/unmount correctly", () => {
  let componentResult: RenderResult;

  beforeEach(() => {
    jest.restoreAllMocks();
    axios.get = jest.fn();
  });

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

describe("Check global View structure", () => {
  let componentResult: RenderResult;

  beforeEach(() => {
    jest.restoreAllMocks();
    // axios.get = jest.fn();
  });

  afterEach(() => {
    componentResult.unmount();
    jest.resetAllMocks();
  });

  afterAll(() => {
    componentResult?.unmount();
  });

  it("By default the component return nothing", () => {
    componentResult = initComponent();
    expect(componentResult.container).toBeEmptyDOMElement();
  });

  it("The component contain a element 'userList-container'", async () => {
    const mockedData = {
      data: { users: [{ name: "rob", _id: "dsqdq", email: "dsqd", online: true, pictureId: 32 }] },
    };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();
    await waitFor(() => {});
    expect(axios.get).toHaveBeenCalledTimes(1);
    const el = document.querySelector(".userList-container");
    expect(el).toBeInTheDocument();
  });
});

describe("Received Users data from useQuery call", () => {
  let componentResult: RenderResult;

  beforeEach(() => {
    jest.restoreAllMocks();
    axios.get = jest.fn();
    store = initStore();
  });

  afterEach(() => {
    componentResult.unmount();
  });

  it("Receive 0 User", async () => {
    const mockedData = { data: { users: generateMockedUser(0) } };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();
    await waitFor(() => {});
    const userContainer = document.querySelector(".userList-container");
    const userCards = document.querySelectorAll(".userCard-container");
    expect(userContainer).toBeInTheDocument();
    expect(userCards.length).toBe(0);
  });

  it("Receive 1 User", async () => {
    const mockedData = { data: { users: generateMockedUser(1) } };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();
    await waitFor(() => {});
    const userCards = document.querySelectorAll(".userCard-container");
    expect(userCards.length).toBe(1);
    screen.getByText("User1");
    screen.getByText("user1@example.com");
    screen.getByText("Connecté");
    screen.getAllByAltText("User Avatar");
    const userPicture = document.querySelector(".userCard-left-picture-container img") as HTMLImageElement;
    expect(userPicture.src).toBe("http://localhost:3000/assets/avatar/avatar_1.png");
  });

  it("Receive 2 User", async () => {
    const mockedData = { data: { users: generateMockedUser(2) } };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();
    await waitFor(() => {});
    const userCards = document.querySelectorAll(".userCard-container");
    expect(userCards.length).toBe(2);
    screen.getByText("User1");
    screen.getByText("user1@example.com");
    screen.getByText("User2");
    screen.getByText("user2@example.com");
    screen.getAllByAltText("User Avatar");
    const connectedText = screen.getAllByText("Connecté");
    expect(connectedText.length).toBe(2);

    const userPicture = document.querySelectorAll(
      ".userCard-left-picture-container img"
    ) as NodeListOf<HTMLImageElement>;

    userCards.forEach((_, i) => {
      expect(userPicture[i].src).toBe(`http://localhost:3000/assets/avatar/avatar_${i + 1}.png`);
    });
  });
  it("Receive 1 User who is disconnected", async () => {
    const mockedData = { data: { users: generateMockedUser(1, false) } };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();
    await waitFor(() => {});
    const userCards = document.querySelectorAll(".userCard-container");
    expect(userCards.length).toBe(1);
    screen.getByText("User1");
    screen.getByText("user1@example.com");
    screen.getByText("Déconnecté");
    screen.getAllByAltText("User Avatar");
    const userPicture = document.querySelector(".userCard-left-picture-container img") as HTMLImageElement;
    expect(userPicture.src).toBe("http://localhost:3000/assets/avatar/avatar_1.png");
  });
  it("If i receive a player with the same info than me. Do not display it", async () => {
    const mockedData = { data: { users: generateMockedUser(1) } };
    axios.get = jest.fn().mockImplementation(() => Promise.resolve(mockedData));
    componentResult = initComponent();

    const user = {
      name: "User1",
      email: "user1@example.com",
      online: true,
      _id: String(1),
      pictureId: 1,
    };
    store.dispatch(setUser(user));

    await waitFor(() => {});
    const userCards = document.querySelectorAll(".userCard-container");
    expect(userCards.length).toBe(0);
  });
  // it("Receive 3 Users with different name, and we want to search a user with the name 'User2'");
});
