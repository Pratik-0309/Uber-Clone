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
    const newCaptain = { fullName: { firstName, lastName }, email, password };
    setCaptainData(newCaptain);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  return (
    <div className="p-7 h-screen flex flex-col justify-between bg-white">
      <div>
        <h1 className="text-2xl mb-8 font-bold flex items-center gap-2">
          Uber{" "}
          <span className="text-sm bg-black text-white px-2 py-0.5 rounded">
            Captain
          </span>
        </h1>

        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-medium mb-2 text-gray-900">
            Get Started as a Captain
          </h3>
          <p className="text-gray-500 text-sm mb-5 leading-tight">
            Register to start earning with the world's largest ride-share fleet.
          </p>

          <h3 className="text-base font-semibold mb-3">What's your name?</h3>
          <div className="flex gap-4 mb-6">
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-sm outline-none"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-sm outline-none"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <h3 className="text-base font-semibold mb-3">Registered Email</h3>
          <input
            required
            className="bg-[#eeeeee] mb-6 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-sm outline-none"
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className="text-base font-semibold mb-3">Create a Password</h3>
          <input
            required
            className="bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-sm outline-none"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="bg-[#111] text-white font-semibold mb-4 rounded-lg px-4 py-2 w-full text-lg">
            Join the Fleet
          </button>

          <p className="text-center text-sm text-gray-600">
            Already driving with us?{" "}
            <Link to="/captain-login" className="text-blue-600 font-medium">
              Login to Dashboard
            </Link>
          </p>
        </form>
      </div>

      <div className="mt-10">
        <p className="text-[12px] text-gray-400 leading-tight">
          This site is protected by reCAPTCHA and the{" "}
          <span className="underline cursor-pointer">
            Google Privacy Policy
          </span>{" "}
          and <span className="underline cursor-pointer">Terms of Service</span>{" "}
          apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
