import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PATH_TITLES: Record<string, string> = {
  "/": "Home",
  "/login": "Login",
  "/register": "Register",
  "/register/form": "Register",
  "/otp/verify": "Enter OTP",
  "/admin-login": "Admin Login",
  "/forgot-password": "Forgot Password",
  "/dashboard": "Dashboard",
  "/ngo/dashboard": "NGO Dashboard",
  "/projects/create": "Create Project",
  "/projects/active": "Active Project",
  "/projects/feedback": "Project Feedback",
  "/profile": "My Profile",
  "/tvw": "Tata Volunteering Week",
  "/tvw/vibe": "TVW Vibe",
  "/proengage": "ProEngage",
  "/disaster-response": "Disaster Response",
  
  "/disaster-response/availability": "DR Availability",
  "/disaster-response/confirmation": "DR Confirmation",
  "/spoc/dashboard": "SPOC Dashboard",
  "/admin/dashboard": "Admin Dashboard",
};

export const usePageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const page = PATH_TITLES[pathname];
    document.title = page ? `${page} | Tata Engage` : "Tata Engage";
  }, [pathname]);
};
