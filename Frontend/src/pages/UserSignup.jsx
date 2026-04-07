import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../util/axiosInstance.js";
import toast from "react-hot-toast";
import { userDataContext } from "../context/UserContext.jsx";

const UserSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { user, setUser, isLoading } = useContext(userDataContext);

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/home");
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      fullName: { firstName, lastName },
      email,
      password,
    };

    try {
      const response = await axiosInstance.post("/api/user/register", newUser);
      const data = response.data;
      if (data.success) {
        setUser(data.user);
        navigate("/home");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setFirstName("");
      setLastName("");
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

      <div className="relative z-10 w-full md:max-w-100 mx-auto bg-white p-8 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-transparent md:border-gray-100 transition-all">
        <div>
          <img
            className="w-14 mb-6"
            src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
            alt="Uber Logo"
          />

          <form onSubmit={handleSubmit}>
            <h3 className="text-base font-bold mb-3 text-gray-900">
              What's your name?
            </h3>
            <div className="flex gap-3 mb-5">
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-[#f2f2f2] w-1/2 rounded-lg px-4 py-2.5 border-none text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                type="text"
                placeholder="First name"
              />
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-[#f2f2f2] w-1/2 rounded-lg px-4 py-2.5 border-none text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                type="text"
                placeholder="Last name"
              />
            </div>

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

            <button className="bg-black text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base hover:bg-zinc-800 active:scale-[0.98] transition-all">
              Create account
            </button>

            <p className="text-center text-[13px] text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-8">
          <p className="text-[11px] leading-tight text-gray-400 text-center">
            By proceeding, you consent to get calls, WhatsApp or SMS messages,
            from Uber and its affiliates to the number provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
