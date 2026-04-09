import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../util/axiosInstance.js";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const response = await axiosInstance.get("/api/user/profile");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log("No active session found.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <userDataContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </userDataContext.Provider>
  );
};

export default UserContext;
