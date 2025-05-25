import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
// import { useCartStore } from "../store/cartStore";
// import { useNotification } from "../context/NotificationContext";

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    // const {count} = useNotification()
    // const {addToCart} = useCartStore() OR
    // const cartCount = useCartStore((state) => state.addToCart)
    // const cartCount = useCartStore((state) => state.cart.length)
    return (
        <React.Fragment>
            <div>Hello "__root"!</div>
            <Outlet />
            <TanStackRouterDevtools />
        </React.Fragment>
    );
}
