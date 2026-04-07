import React from "react";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div className="relative">
      <div className="bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1638745392689-515e499a3711?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen pt-5 flex justify-between flex-col w-full">
        
        <h1 className="text-3xl ml-5 font-bold text-white md:text-4xl lg:ml-10">
          Uber
        </h1>

        <div className="bg-white pb-8 py-5 px-6 md:max-w-100 md:mx-auto md:mb-12 md:rounded-2xl md:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all">
          
          <h2 className="text-2xl font-bold text-gray-900 md:text-[26px] leading-tight">
            Get Started with Uber
          </h2>
          
          <p className="text-gray-500 text-sm mt-2 md:text-[13px]">
            Experience the simplest way to get around at the tap of a button.
          </p>

          <Link
            to={"/login"}
            className="flex items-center justify-center w-full bg-black text-white py-3.5 rounded-lg mt-6 font-semibold text-lg hover:bg-zinc-800 transition-all active:scale-[0.98]"
          >
            Continue
          </Link>
        </div>
      </div>

      <div className="hidden md:block absolute inset-0 bg-black/10 pointer-events-none"></div>
    </div>
  );
};

export default Start;