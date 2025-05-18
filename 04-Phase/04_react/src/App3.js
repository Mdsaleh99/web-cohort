import React from "https://esm.sh/react@19.1.0";
import ReactDOM from "https://esm.sh/react-dom@19.1.0/client";

const Chai = (props) => {
    // props is properties which is an object
    console.log(props);
    
    return React.createElement("div", {}, [
        React.createElement("h1", {}, props.name),
        React.createElement("p", {}, props.cost)
    ])
}
// now this chai is a generic component
// iss chai component ko html me convert karna hai we use most popular babel
// https://babeljs.io/

// https://biomejs.dev/

const App = () => {
    return React.createElement(
        "div",
        {
            class: "test",
        },
        [
            React.createElement("h1", {}, "Chai variations by chai code"),
            React.createElement(Chai, {
                name: "Masala chai",
                cost: "20"
            }),
            React.createElement(Chai, {
                name: "Ginger chai",
                cost: "20"
            }),
            React.createElement(Chai, {
                name: "Lemon chai",
                cost: "20"
            })
        ]
    );
};

const container = document.getElementById("root");

const root = ReactDOM.createRoot(container); // it is a virtual DOM and we controlling programtically,    ReactDOM is a react extension in browser
root.render(React.createElement(App));

// react k pass jab bhi naya element aayega tab oh 2 elements ko compare karta hai. jo changes hai oh load karta hai. it is done by diffing algorithm which also used in git
