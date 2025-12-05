import { Routes, BrowserRouter, Route } from "react-router-dom";
import Login from "./pages//Login";
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import MyPortfolio from "./pages/MyPortfolio";
import EditProfile from "./pages/EditProfile";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrivateRoute from "./components/routing/PrivateRoute";
import Header from "./components/layout/Header";
import Friends from "./features/friend/FriendsView";

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
          <Route
            path="edit_profile"
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />

          <Route
            path="my_friends"
            element={
              <PrivateRoute>
                <Friends />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
