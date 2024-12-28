import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";

import Accordion from "./pages/accordion.tsx";
import Palette from "./pages/colors/palette.tsx";
import Grid from "./pages/grid/grid.tsx";
const Colors = lazy(() => import("./pages/colors/page.tsx"));
// const Accordion = lazy(() => import("./pages/accordion.tsx"))

const router = createBrowserRouter([
	{
		path: "/",
		element: <div>Hello world!</div>,
	},
	{
		path: "/colors",
		element: (
			<Suspense fallback={<div>Loading...</div>}>
				<Colors />
			</Suspense>
		),
	},
	{
		path: "/accordion",
		element: <Accordion />,
		// element: (
		// 	<Suspense fallback={<div>Loading...</div>}>
		// 		<Accordion />
		// 	</Suspense>
		// ),
	},
	{
		path: "/sentiments",
		element: <Palette />,
	},
	{
		path: "/grid",
		element: <Grid />,
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
