import { fetchUser } from "@client/api/User";
import {
  Auth,
  Dashboard,
  DashboardEdit,
  DashboardView,
  Footer,
  Header,
  LoginForm,
  RegisterForm,
} from "@client/components";
import { useQuery } from "@tanstack/react-query";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProfileSlice } from "./features/profileSlice";
import { useMemo } from "react";
import { Loader } from "@client/components/ui/Loader";

import "./app.scss";

export default function App() {
  const { data: username, status: profileStatus } = useQuery({
    queryFn: fetchUser,
    queryKey: ["profile"],
    retry: 0,
  });

  const isLoading = profileStatus === "pending";
  const isAuthenticated = profileStatus === "success";

  const userProfile: ProfileSlice = useMemo(
    () =>
      isAuthenticated
        ? { username, isAuth: true }
        : { username, isAuth: false },
    [isAuthenticated, username],
  );

  return (
    <>
      <Header profile={userProfile} />
      <main>
        {isLoading ? (
          <Loader />
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Auth />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            >
              <Route index element={<Navigate to="/login" replace />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="login" element={<LoginForm />} />
            </Route>

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />
              }
            >
              <Route index element={null} />
              <Route path=":id" element={<DashboardView />} />
              <Route path=":id/edit" element={<DashboardEdit />} />

              <Route path="archive">
                <Route index element={null} />
                <Route path=":id" element={<DashboardView />} />
                <Route path=":id/edit" element={<DashboardEdit />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
      <Footer />
    </>
  );
}
