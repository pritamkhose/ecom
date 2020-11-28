import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { ApolloProvider } from "react-apollo";
import "bootstrap/dist/css/bootstrap.min.css";
import client from "./apollo";

import reducer, { initialState } from "./Reducer";
import { StateProvider } from "./StateProvider";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <StateProvider initialState={initialState} reducer={reducer}>
        <App />
      </StateProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

if (module.hot) module.hot.accept();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
