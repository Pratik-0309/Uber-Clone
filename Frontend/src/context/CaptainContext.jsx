import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../util/axiosInstance.js";

export const captainDataContext = createContext();

const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const fetchCaptainData = async () => {
    try {
      const response = await axiosInstance.get("/api/captain/profile");
      if (response.data.success) {
        setCaptain(response.data.captain);
      }
    } catch (error) {
      console.log("No active session found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaptainData();
  }, []);
  
  return (
    <captainDataContext.Provider value={{ captain, setCaptain, isLoading }}>
      {children}
    </captainDataContext.Provider>
  );
};

export default CaptainContext;
