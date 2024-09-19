import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";
import BottomNavbar from "./components/common/BottomNavbar";
import Profile from "./pages/profile/Profile";
import JobPosts from "./components/common/job/JobPosts";
import AllResource from "./components/common/Resources/AllResource";

const App = () => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/v1/auth/me");
        const data = await res.json();

        if (data.error) {
          return null;
        }

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  return (
    <div className="">
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile/:username"
          element={authUser ? <Profile /> : <Navigate to="/" />}
        />
        <Route
          path="/jobs"
          element={authUser ? <JobPosts /> : <Navigate to="/" />}
        />
        <Route
          path="/resource"
          element={authUser ? <AllResource /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
      {authUser && <BottomNavbar />}
    </div>
  );
};

export default App;
