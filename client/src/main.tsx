import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { AlertProvider } from "./contexts/alertContext.tsx";
import store from "./store.ts";
import { Provider } from "react-redux";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <AlertProvider>
      <App />
    </AlertProvider>
  </Provider>
);
