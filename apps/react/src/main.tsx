import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Colors from "./pages/colors/page.tsx";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>Hello world!</div>,
	},
	{
		path: "/colors",
		element: <Colors />,
	},
]);

const root = document.getElementById("root");

if (!root) {
	throw new Error("No root element found");
}

createRoot(root).render(
	<StrictMode>
		<RouterProvider router={router} />
	</StrictMode>,
);
