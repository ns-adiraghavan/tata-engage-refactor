import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

const VIEW_TO_PATH: Record<string, string> = {
  home: "/",
  login: "/login",
  "register-role": "/register",
  "register-form": "/register/form",
  otp: "/otp/verify",
  "forgot-password": "/forgot-password",
  dashboard: "/dashboard",
  "volunteer-hub": "/hub",
  "ngo-hub": "/ngo/hub",
  "spoc-hub": "/spoc/hub",
  "ngo-dashboard": "/ngo/dashboard",
  "create-project": "/projects/create",
  "active-project-management": "/projects/active",
  "project-feedback": "/projects/feedback",
  profile: "/profile",
  tvw: "/tvw",
  "tvw-vibe": "/tvw/vibe",
  proengage: "/proengage",
  "my-applications": "/my-applications",
  "disaster-response": "/disaster-response",
  
  "dr-availability-form": "/disaster-response/availability",
  "dr-confirmation": "/disaster-response/confirmation",
  "spoc-dashboard": "/spoc/dashboard",
  "admin-dashboard": "/admin/dashboard",
};

export const useAppNavigate = () => {
  const nav = useNavigate();
  return useCallback(
    (view: string) => {
      const path = VIEW_TO_PATH[view] || "/";
      nav(path);
      window.scrollTo(0, 0);
    },
    [nav]
  );
};
