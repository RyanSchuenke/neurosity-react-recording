import React from "react";
import { navigate } from "@reach/router";

import { Status } from "./Status";
import { Footer } from "./Footer";

export function Nav() {
  function goToLogout() {
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/logout");
    }
  }

  return (
    <nav className="card">
      <Status />
      <button onClick={goToLogout} className="card-btn">
        Logout
      </button>
      <Footer />
    </nav>
  );
}
