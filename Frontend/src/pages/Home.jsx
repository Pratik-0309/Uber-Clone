import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1527603815363-e79385e0747e?q=80&w=1952&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-5 flex justify-between flex-col w-full bg-red-300">
        <h1 className="text-3xl ml-3 font-bold text-amber-50">Uber</h1>
        <div className="bg-white pb-6 py-4 px-4">
          <h2 className="text-3xl font-semibold">Get Started with Uber</h2>
          <Link
            to={"/login"}
            className="flex items-center justify-center w-full bg-black text-white py-3 rounded-md mt-4 font-semibold   "
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
