import React, { useState } from "react";
import { Link } from "react-router-dom";

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [captainData, setCaptainData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCaptain = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    };
    setCaptainData(newCaptain);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between">
      <div>
        <h1 className="text-3xl ml-0.5 mb-8 font-bold text-black">Uber</h1>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-2">What's your name</h3>
          <div className="flex gap-4 mb-5">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              required
              type="text"
              placeholder="First Name"
            />
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
              required
              type="text"
              placeholder="Last Name"
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">What's your email</h3>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            required
            type="email"
            placeholder="email@example.com"
          />
          <h3 className="text-lg font-semibold mb-2">Enter Password</h3>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#eeeeee] mb-5 rounded px-4 py-2 w-full text-lg placeholder:text-base"
            required
            type="password"
            placeholder="Password"
          />
          <button className="bg-[#111] text-white font-semibold mb-4 rounded px-4 py-2 w-full text-lg placeholder:text-base">
            Register
          </button>
          <p className="text-center">
            Already have a account?{" "}
            <Link to={"/captain-login"} className="text-blue-500">
              Login Here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className="text-xs leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline">Google Privacy policy</span> and{" "}
          <span className="underline">Terms of service apply</span>
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
