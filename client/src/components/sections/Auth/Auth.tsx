import { Outlet } from "react-router-dom";

import "./Auth.scss";

export const Auth = () => {
  return (
    <section className="auth">
      <div className="container">
        <Outlet />
      </div>
    </section>
  );
};
