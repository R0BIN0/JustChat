import ReactDOM from "react-dom/client";
import App from "./App/App.tsx";
import { Provider } from "react-redux";
import store from "./redux/store.tsx";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
export const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
        </Provider>
    </QueryClientProvider>
);
