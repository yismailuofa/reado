import "@radix-ui/themes/styles.css";
import "./styles.css";

import React from "react";
import * as ReactDOM from "react-dom/client";

import { Theme } from "@radix-ui/themes";
import { Provider } from "react-redux";
import App from "./components/App";
import { loadSources } from "./features/sources/sourcesSlice";
import { store } from "./store";

async function start() {
  await store.dispatch(loadSources());

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
        <Theme accentColor="bronze">
          <App />
        </Theme>
      </Provider>
    </React.StrictMode>
  );
}

start();
