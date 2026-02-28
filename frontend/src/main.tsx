import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style/auth.css";
import "./style/board.css";

// Add basic CSS reset
const style = document.createElement('style');
style.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #f8f9fa;
  }
  
  #root {
    min-height: 100vh;
  }
`;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode> 
    <App />
  </React.StrictMode>
);