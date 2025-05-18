// https://unpkg.com/react@18.3.1/umd/react.development.js => in this their is a method createElement it has parameters type, config and children. children is a special property in react. it can be new element or anything
//  the config is a attributes

const App = () => {
    return React.createElement(
        "div",
        {
            class: 'test'
        },
        React.createElement(
            "h1",
            {},
            "Chai, chill and react - React - 18"
        )
    )
}

const container = document.getElementById('root')

// https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js => in this react dom has createRoot method
const root = ReactDOM.createRoot(container) // ReactDOM is a react extension in browser
root.render(React.createElement(App))