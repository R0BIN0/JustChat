import { render, RenderResult, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { IStore, initStore } from "../src/redux/store";
export const queryClient = new QueryClient();

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import FormHeader from "../src/components/FormHeader/FormHeader";

let store: IStore;

const initComponent = ({ title, subtitle }: { title: string; subtitle: string }): RenderResult => {
  store = initStore();

  return render(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <FormHeader title={title} subtitle={subtitle} />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
};

describe("Component mount/unmount correctly", () => {
  let componentResult: RenderResult;

  afterEach(() => {
    componentResult.unmount();
  });

  it("Verify if the component mount", () => {
    componentResult = initComponent({ title: "", subtitle: "" });
  });

  it("Verify if the component unmount", () => {
    componentResult = initComponent({ title: "", subtitle: "" });
    componentResult.unmount();
  });
});

describe("FormHeader UI is correct", () => {
  let componentResult: RenderResult;

  afterEach(() => {
    componentResult.unmount();
  });

  it("A container is displayed", () => {
    componentResult = initComponent({ title: "", subtitle: "" });
    const el = screen.getByTestId("formHeader-container");
    expect(el).toBeInTheDocument();
  });

  it("A title is displayed", () => {
    componentResult = initComponent({ title: "Title", subtitle: "" });
    const el = screen.getByText("Title");
    expect(el).toBeInTheDocument();
  });

  it("A subtitle is displayed", () => {
    componentResult = initComponent({ title: "", subtitle: "Subtitle" });
    const el = screen.getByText("Subtitle");
    expect(el).toBeInTheDocument();
  });

  it("A title and subtitle are displayed", () => {
    componentResult = initComponent({ title: "Title", subtitle: "Subtitle" });
    const title = screen.getByText("Title");
    const subTitle = screen.getByText("Subtitle");
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
  });
});
