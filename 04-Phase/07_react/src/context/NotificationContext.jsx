import { createContext, useContext, useState } from "react"

const NotificationContext = createContext()
// console.log(NotificationContext);


export function NotificationProvider({ children }) {
    const [count, setCount] = useState(0)

    const addNotification = () => {
        setCount((prev) => prev + 1)
    }

    const removeNotification = () => {
        setCount(0)
    }

    return (
        <NotificationContext.Provider value={{ count, addNotification, removeNotification }}>
            {/* the children has value access */}
            {children}
        </NotificationContext.Provider>
    )
}

// custom hook
export function useNotification() {
    return useContext(NotificationContext)
}