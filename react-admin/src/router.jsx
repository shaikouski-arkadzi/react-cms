import { createBrowserRouter, redirect } from "react-router-dom";
import { Editor } from "./components/editor";
import { Login } from "./components/login";

export const router = createBrowserRouter([
  {
    path: "/",
    loader: () => redirect("/editor"),
  },
  {
    path: "/editor",
    element: <Editor />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
