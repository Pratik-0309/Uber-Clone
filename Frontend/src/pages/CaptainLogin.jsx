import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { captainDataContext } from "../context/CaptainContext";
import axiosInstance from "../util/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { captain, setCaptain, isLoading } = useContext(captainDataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && captain) {
      navigate("/captain-home");
    }
  }, [captain, isLoading, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/api/captain/login", {
        email,
        password,
      });
      const data = response.data;
      if (data.success) {
        setCaptain(data.captain);
        toast.success(data.message);
        navigate("/captain-home");
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

      <div className="relative z-10 w-full md:max-w-100 mx-auto bg-white p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all">
        <div>
          <h1 className="text-2xl mb-6 font-bold flex items-center gap-2 md:text-[26px]">
            Uber{" "}
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">
              Captain
            </span>
          </h1>

          <form onSubmit={handleSubmit}>
            <h3 className="text-lg font-bold mb-1 text-gray-900 md:text-xl">
              Welcome back, Captain
            </h3>
            <p className="text-gray-400 text-[13px] mb-6 leading-tight">
              Sign in to manage your rides and view your daily earnings.
            </p>

            <h3 className="text-sm font-semibold mb-2 text-gray-800">
              Registered Email
            </h3>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#f2f2f2] mb-5 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
              required
              type="email"
              placeholder="captain@example.com"
            />

            <h3 className="text-sm font-semibold mb-2 text-gray-800">
              Password
            </h3>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#f2f2f2] mb-5 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
              required
              type="password"
              placeholder="Enter your password"
            />

            <button className="bg-black text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base hover:bg-zinc-800 transition-all active:scale-[0.98]">
              Access Dashboard
            </button>

            <p className="text-center text-[13px] text-gray-500">
              Want to join our fleet?{" "}
              <Link
                to={"/captain-signup"}
                className="text-blue-600 font-medium hover:underline"
              >
                Become a Captain
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
            to={"/login"}
            className="bg-[#10b461] flex items-center justify-center text-white font-semibold rounded-lg px-4 py-3 w-full text-base hover:bg-[#0e9e55] transition-all active:scale-[0.98]"
          >
            Switch to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CaptainLogin;
