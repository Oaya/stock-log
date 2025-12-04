import { Routes, BrowserRouter, Route } from "react-router-dom";
import Login from "./pages//Login";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import MyPortfolio from "./pages/MyPortfolio";
import Header from "./components/Header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route
            path="my_portfolio"
            element={
              <PrivateRoute>
                <MyPortfolio />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
