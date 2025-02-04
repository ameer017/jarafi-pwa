import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import capsuleClient from "../../constant/capsuleClient";
import { toast } from "react-toastify";

const IDLE_TIMEOUT = 60 * 60 * 1000;

const AuthRoute = ({ element }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = await capsuleClient.isFullyLoggedIn();
      console.log(isLoggedIn);
      if (!isLoggedIn) {
        toast.info("Session expired. Please login again.");
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return element;
};

const IdleTimeout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        capsuleClient.logout();
        navigate("/login");
      }, IDLE_TIMEOUT);
    };

    const events = ["mousemove", "keydown", "scroll", "click"];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
      clearTimeout(timeout);
    };
  }, [navigate]);

  return null;
};

export { AuthRoute, IdleTimeout };
