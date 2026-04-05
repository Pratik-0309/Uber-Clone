import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captainData, setCaptainData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptainData({ email, password });
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <h1 className="text-2xl mb-8 font-bold flex items-center gap-2">
          Uber{" "}
          <span className="text-sm bg-black text-white px-2 py-0.5 rounded">
            Captain
          </span>
        </h1>

        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-2">Welcome back, Captain</h3>
          <p className="text-gray-500 text-sm mb-5 leading-tight">
            Sign in to manage your rides and view your daily earnings.
          </p>

          <h3 className="text-base font-semibold mb-3">Registered Email</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-sm"
            required
            type="email"
            placeholder="captain@example.com"
          />

          <h3 className="text-base font-semibold mb-3">Password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-sm"
            required
            type="password"
            placeholder="Enter your password"
          />

          <button className="bg-[#111] text-white font-semibold mb-4 rounded-lg px-4 py-2 w-full text-lg">
            Access Dashboard
          </button>

          <p className="text-center text-sm text-gray-600">
            Want to join our fleet?{" "}
            <Link to={"/captain-signup"} className="text-blue-600 font-medium">
              Become a Captain
            </Link>
          </p>
        </form>
      </div>

      <div className="mt-10">
        <Link
          to={"/login"}
          className="bg-[#10b461] flex items-center justify-center text-white font-semibold mb-2 rounded-lg px-4 py-2 w-full text-lg"
        >
          Switch to User Login
        </Link>
      </div>
    </div>
  );
};

export default CaptainLogin;
