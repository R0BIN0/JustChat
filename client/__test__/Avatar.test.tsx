import { fireEvent, render, renderHook, RenderHookResult, RenderResult, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IStore, initStore } from "../src/redux/store";
export const queryClient = new QueryClient();

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import Avatar from "../src/components/Avatar/Avatar";
import { initialState } from "../src/components/Avatar/Avatar.reducer";
import { useAvatar } from "../src/components/Avatar/Avatar.logic";
import { vi as jest } from "vitest";
import { AVATAR_LENGTH } from "../src/const/const";
import { act } from "react-dom/test-utils";

let store: IStore;
export type IUseAvatar = ReturnType<typeof useAvatar>;
type IChildren = {
  children: React.ReactElement<unknown, string | React.JSXElementConstructor<unknown>>;
};

const initHook = (defaultAvatarIndex: number): RenderHookResult<IUseAvatar, unknown> => {
  store = initStore();

  const props = {
    handleAvatar: jest.fn(),
    defaultAvatar: defaultAvatarIndex,
  };

  const wrapper = ({ children }: IChildren) => (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Avatar handleAvatar={props.handleAvatar} defaultAvatar={props.defaultAvatar} />
        {children}
      </Provider>
    </QueryClientProvider>
  );

  return renderHook(() => useAvatar(props), { wrapper });
};

const initComponent = (defaultAvatarIndex: number): RenderResult => {
  store = initStore();
  const handleAvatar = jest.fn();

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <Avatar handleAvatar={handleAvatar} defaultAvatar={defaultAvatarIndex} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("Hook mount/unmount correctly", () => {
  let hookResult: RenderHookResult<IUseAvatar, unknown>;

  afterEach(() => hookResult.unmount());

  it("The hook is mounting without issue", () => {
    hookResult = initHook(0);
  });

  it("The initial state typeof of the hook is right", () => {
    hookResult = initHook(0);
    expect(typeof hookResult.result.current).toBe(typeof initialState);
  });

  it("The initial state values of the hook is right", () => {
    hookResult = initHook(0);
    expect(hookResult.result.current.currentIdx).toBe(0);
  });

  it("Verify that the hooks is unmouting correctly", () => {
    hookResult = initHook(0);
    hookResult.unmount();
  });

  it("Verify that the initial state is correctly cleaned after the hook is unmounted", () => {
    initialState.currentIdx = 1;
    hookResult = initHook(1);
    expect(hookResult.result.current.currentIdx).toBe(-1);
    hookResult.unmount();
    expect(initialState.currentIdx).toBe(0);
  });
});

describe("Component mount/unmount correctly", () => {
  let componentResult: RenderResult;

  afterEach(() => {
    componentResult.unmount();
  });

  it("Verify if the component mount", () => {
    componentResult = initComponent(0);
  });

  it("Verify if the component unmount", () => {
    componentResult = initComponent(0);
    componentResult.unmount();
  });
});

describe("Avatar component is correctly rendered", () => {
  let hookResult: RenderHookResult<IUseAvatar, unknown>;

  afterEach(() => {
    hookResult?.unmount();
  });

  it("previous button is displayed", () => {
    initHook(0);
    const el = screen.getByTestId("avatar-btn-prev");
    expect(el).toBeInTheDocument();
  });

  it("next button is displayed", () => {
    initHook(0);
    const el = screen.getByTestId("avatar-btn-next");
    expect(el).toBeInTheDocument();
  });

  it("All pictures are displayed", () => {
    initHook(0);
    Array.from({ length: AVATAR_LENGTH }).forEach((_, i) => {
      const el = screen.getByTestId(`avatar-picture-${i + 1}`);
      expect(el).toBeInTheDocument();
    });
  });
});

describe("Test Avatar component functionnalities", () => {
  let hookResult: RenderHookResult<IUseAvatar, unknown>;

  afterEach(() => {
    hookResult?.unmount();
  });

  it("Default picture id is number 2", () => {
    hookResult = initHook(0);
    const pictureEl = screen.getByTestId("avatar-picture-2");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });

  it("Next button modify the current picture id", () => {
    hookResult = initHook(0);
    const el = screen.getByTestId("avatar-btn-next");
    act(() => fireEvent.click(el));
    const pictureEl = screen.getByTestId("avatar-picture-3");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });

  it("Prev button modify the current picture id", () => {
    hookResult = initHook(0);
    const el = screen.getByTestId("avatar-btn-prev");
    act(() => fireEvent.click(el));
    const pictureEl = screen.getByTestId("avatar-picture-1");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });

  it("Click twice on next button", () => {
    hookResult = initHook(0);
    const el = screen.getByTestId("avatar-btn-next");
    act(() => fireEvent.click(el));
    act(() => fireEvent.click(el));
    const pictureEl = screen.getByTestId("avatar-picture-4");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });

  it("Click twice on prev button with default avatar as 0", () => {
    hookResult = initHook(0);
    const el = screen.getByTestId("avatar-btn-prev");
    act(() => fireEvent.click(el));
    act(() => fireEvent.click(el));
    const pictureEl = screen.getByTestId("avatar-picture-1");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });

  it("Click on next button even the limit is reached", () => {
    hookResult = initHook(AVATAR_LENGTH);
    const el = screen.getByTestId("avatar-btn-next");
    act(() => fireEvent.click(el)); // Supposed to do nothing
    const pictureEl = screen.getByTestId("avatar-picture-10");
    expect(pictureEl.getAttribute("class")).toBe("current-selected-avatar");
  });
});
