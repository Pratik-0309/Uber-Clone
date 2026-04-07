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
    <div
      className="relative min-h-screen w-full flex items-center justify-center p-5 md:p-10"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1638745392689-515e499a3711?q=80&w=1170&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/70 pointer-events-none"></div>

      <div className="relative z-10 w-full md:max-w-100 bg-white p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all">
        <div className="flex flex-col">
          <img
            className="w-14 mb-6"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />

          <form onSubmit={handleSubmit}>
            <h3 className="text-base font-bold mb-2 text-gray-900">
              What's your email?
            </h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#f2f2f2] mb-5 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
              type="email"
              placeholder="email@example.com"
            />

            <h3 className="text-base font-bold mb-2 text-gray-900">
              Enter Password
            </h3>
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#f2f2f2] mb-6 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
              type="password"
              placeholder="password"
            />

            <button className="bg-black text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base hover:bg-zinc-800 transition-all active:scale-[0.98]">
              Login
            </button>

            <p className="text-center text-[13px] text-gray-500">
              New here?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Create new Account
              </Link>
            </p>
          </form>

          <div className="relative flex py-6 items-center">
            <div className="grow border-t border-gray-200"></div>
            <span className="shrink mx-3 text-gray-400 text-[10px] uppercase">
              or
            </span>
            <div className="grow border-t border-gray-200"></div>
          </div>

          <Link
            to="/captain-login"
            className="bg-[#10b461] flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-base hover:bg-[#0e9e55] transition-all active:scale-[0.98]"
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
