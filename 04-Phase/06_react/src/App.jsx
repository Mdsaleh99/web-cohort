import { useState, useEffect } from "react"
import { ChaiMenu } from "./AllChai"

export function App() {
    const [message, setMessage] = useState("Loading...")
    useEffect(() => {
        fetch("https://api.freeapi.app/api/v1/public/randomusers/13")
            .then((res) => res.json())
            .then((data) => setMessage(data.message))
            .catch(() => setMessage("Failed to load"))
    }, []) // when dependcy array is empty it runs only one time


    return (
        <div>
            <h1>Welcome to chaicode</h1>
            <p>Serving hot chai with react</p>
            <h2>{message}</h2>
            <ChaiMenu />
        </div>
    )
}