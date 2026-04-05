import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../util/axiosInstance.js";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser, isLoading } = useContext(userDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/user/login", {
        email,
        password,
      });
      const data = response.data;
      if (data.success) {
        setUser(data.user);
        navigate("/home");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setEmail("");
      setPassword("");
    }
  };

  if (isLoading) return null;

  return (
    <div className="p-7 h-screen flex flex-col justify-between bg-white">
      <div>
        <img
          className="w-16 mb-10"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt="Uber Logo"
        />

        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-2 text-gray-900">
            What's your email?
          </h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-lg font-medium mb-2 text-gray-900">
            Enter Password
          </h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base"
            type="password"
            placeholder="password"
          />

          <button className="bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg">
            Login
          </button>

          <p className="text-center text-gray-600">
            New here?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Create new Account
            </Link>
          </p>
        </form>
      </div>
      <div>
        <Link
          to="/captain-login"
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
};

export default UserLogin;
