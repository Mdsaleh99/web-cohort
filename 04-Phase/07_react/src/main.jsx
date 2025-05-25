import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { routeTree } from "./routeTree.gen";
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { NotificationProvider } from './context/NotificationContext.jsx';

const router = createRouter({ routeTree });

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <NotificationProvider>
            {/* <App /> */}
            <RouterProvider router={router} />
        </NotificationProvider>
    </StrictMode>,
);
