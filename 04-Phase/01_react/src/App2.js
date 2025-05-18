import React from "https://esm.sh/react@19.1.0";
import ReactDOM from "https://esm.sh/react-dom@19.1.0/client";

const App = () => {
    return React.createElement(
        "div",
        {
            class: "test",
        },
        React.createElement("h1", {}, "Chai, chill and react - React - 19")
    );
};

const container = document.getElementById("root");

const root = ReactDOM.createRoot(container); // it is a virtual DOM and we controlling programtically,    ReactDOM is a react extension in browser
root.render(React.createElement(App));

// react k pass jab bhi naya element aayega tab oh 2 elements ko compare karta hai. jo changes hai oh load karta hai. it is done by diffing algorithm which also used in git
