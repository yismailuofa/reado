import "@radix-ui/themes/styles.css";
import "./styles.css";

import React from "react";
import * as ReactDOM from "react-dom/client";

import { Theme } from "@radix-ui/themes";
import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme accentColor="bronze">
      <App />
    </Theme>
  </React.StrictMode>
);
