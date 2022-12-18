import React from "react";
import ReactDOM from "react-dom/client";
import io from "socket.io-client";
import App from "./App";
import "./index.css";
const socket = io("http://localhost:3001/");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App socket={socket} />
  </React.StrictMode>
);
