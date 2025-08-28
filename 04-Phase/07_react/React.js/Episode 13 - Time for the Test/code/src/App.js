import React, { lazy, Suspense } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import Header from './components/Header';
import Body from './components/Body';
// import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import Error from './components/Error';
import RestaurantMenu from './components/RestaurantMenu';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import UserContext from './utils/UserContext';
import { Provider } from 'react-redux';
import appStore from './utils/appStore';
import Cart from './components/Cart';

const Grocery = lazy(() => import('./components/Grocery'));

const AppLayout = () => {
  const [userName, setUserName] = useState();

  // Authentication
  useEffect(() => {
    // Make an API call and send username and password
    const data = {
      name: 'Vasu K',
    };
    setUserName(data.name);
  }, []);

  return (
    <Provider store={appStore}>
      <UserContext.Provider value={{ loggedInUser: userName, setUserName }}>
        <div className="app">
          <Header />
          <Outlet />
        </div>
      </UserContext.Provider>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Body />,
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '/contact',
        element: <Contact />,
      },
      {
        path: '/grocery',
        element: (
          <Suspense fallback={<h1>Loading...</h1>}>
            <Grocery />
          </Suspense>
        ),
      },
      {
        path: '/restaurants/:resId',
        element: <RestaurantMenu />,
      },
      {
        path: '/cart',
        element: <Cart />,
      },
    ],
    errorElement: <Error />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<RouterProvider router={appRouter} />);
