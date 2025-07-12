import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      if (!user) {
        setCheckingProfile(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("bio, location")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfileComplete(false);
      } else {
        const isComplete = Boolean(data?.bio?.trim() && data?.location?.trim());
        setProfileComplete(isComplete);
      }
      setCheckingProfile(false);
    };

    if (user) {
      setCheckingProfile(true);
      checkProfile();
    } else {
      setCheckingProfile(false);
    }
  }, [user, location.pathname]);

  if (loading || checkingProfile) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isOnNewUserPage = location.pathname === "/newuser";

  if (!profileComplete && !isOnNewUserPage) {
    return <Navigate to="/newuser" replace />;
  }

  if (profileComplete && isOnNewUserPage) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default PrivateRoute;
