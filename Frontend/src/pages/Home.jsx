import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setpanelOpen] = useState(false);

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const headerRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useGSAP(() => {
    if (panelOpen) {
      const isMobile = window.innerWidth < 768;
      
      gsap.to(panelRef.current, {
        height: isMobile ? "70%" : "auto",
        maxHeight: isMobile ? "none" : "400px",
        opacity: 1,
        padding: 20,
        duration: 0.5,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        opacity: 0,
        padding: 0,
        duration: 0.5,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  return (
    <div className="h-screen relative overflow-hidden bg-zinc-100">
      <div
        className={`absolute top-5 left-5 z-50 md:left-10 md:top-8 transition-opacity duration-300 ${
          panelOpen ? "opacity-0 pointer-events-none md:opacity-100" : "opacity-100"
        }`}
      >
        <h1 className="text-3xl font-bold tracking-tighter text-white md:text-4xl">
          Uber
        </h1>
      </div>

      <div className="h-screen w-screen absolute inset-0 z-0">
        <img
          className="h-full w-full object-cover"
          src="https://plus.unsplash.com/premium_photo-1712828731398-ad18ac5a9748?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="map-background"
        />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col justify-end md:justify-center md:items-start md:pl-10 lg:pl-20 pointer-events-none">
        
        <div className="w-full md:w-112.5 lg:w-125 h-screen absolute top-0 left-0 md:relative md:h-auto flex flex-col justify-end pointer-events-none">
          
          <div
            ref={headerRef}
            className="h-[30%] md:h-auto p-6 bg-white relative pointer-events-auto md:rounded-t-2xl md:shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-2xl font-bold text-gray-900">Find a trip</h4>
              <button
                ref={panelCloseRef}
                onClick={() => setpanelOpen(false)}
                className="opacity-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 md:hidden"
              >
                <i className="ri-arrow-down-s-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-4">
              <div className="absolute left-[1.15rem] top-1/2 -translate-y-1/2 h-[55%] w-0.5 bg-gray-900 rounded-full z-10"></div>

              <div className="relative">
                <i className="ri-checkbox-blank-circle-fill absolute left-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-900 z-20"></i>
                <input
                  onClick={() => setpanelOpen(true)}
                  onChange={(e) => setPickup(e.target.value)}
                  value={pickup}
                  className="bg-gray-100 px-12 py-3.5 text-base rounded-xl w-full outline-none focus:ring-2 focus:ring-black transition-all"
                  type="text"
                  placeholder="Add a pickup location"
                />
              </div>

              <div className="relative">
                <i className="ri-map-pin-2-fill absolute left-4 top-1/2 -translate-y-1/2 text-lg text-gray-900 z-20"></i>
                <input
                  onClick={() => setpanelOpen(true)}
                  onChange={(e) => setDestination(e.target.value)}
                  value={destination}
                  className="bg-gray-100 px-12 py-3.5 text-base rounded-xl w-full outline-none focus:ring-2 focus:ring-black transition-all"
                  type="text"
                  placeholder="Enter your destination"
                />
              </div>
            </form>
          </div>

          <div
            ref={panelRef}
            className="bg-white overflow-y-auto opacity-0 pointer-events-auto md:rounded-b-2xl md:shadow-xl"
          >
            <LocationSearchPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;