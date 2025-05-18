import React from "react";
import ReactDOM from "react-dom/client"

import { App } from "./App.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"))

root.render(<App />)

// https://esbuild.github.io/
// https://rollupjs.org/

// Manual installation of vite ---> npm i --save-dev vite @vitejs/plugin-react
// we doing this 05_react with node and vite, previsouly  we doing using react and react-dom cdns

// vite expectation is the files should be inside src and file extension should be jsx not js in vite