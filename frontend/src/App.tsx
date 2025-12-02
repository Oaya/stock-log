import "./App.css";

import { Routes, BrowserRouter, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					index
					element={<Home />}
				/>
				<Route
					path="login"
					element={<Login />}
				/>
				{/* <Route
					path="signup"
					element={<Signup />}
				/> */}
			</Routes>
		</BrowserRouter>
	);
}
