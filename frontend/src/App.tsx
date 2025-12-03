import { Routes, BrowserRouter, Route } from "react-router-dom";
import Login from "./pages//Login";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import MyPortfolio from "./pages/MyPortfolio";
import Header from "./components/Header";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="my_portfolio" element={<MyPortfolio />} />
      </Routes>
    </BrowserRouter>
  );
}
