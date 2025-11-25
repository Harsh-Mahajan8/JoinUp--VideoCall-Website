import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "./pages/landing.jsx";
import Authentication from "./pages/Authentication.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import RootLayout from "./RootLayout.jsx";
import { Children } from "react";
import Videomeet from "./pages/Videomeet.jsx";
const routes = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/auth", element: <Authentication /> },
      {path:"/:url", element:<Videomeet/>}
    ],
  },
]);
export default function App() {
  return <RouterProvider router={routes} />;
}
