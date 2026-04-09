import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { captainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../util/axiosInstance.js";

const CaptainSignup = () => {
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");

  const { captain, setCaptain, isLoading } = useContext(captainDataContext);
  const navigate = useNavigate();

   useEffect(() => {
      if (!isLoading && captain) {
        navigate("/captain-home");
      }
    }, [captain, isLoading, navigate]);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCaptain = {
      fullName: { firstName, lastName },
      email,
      password,
      status: "active",
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/captain/register",
        newCaptain,
      );
      const data = response.data;
      if (data.success) {
        setCaptain(data.captain);
        navigate("/captain-home");
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
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");
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
          <h1 className="text-2xl mb-6 font-bold flex items-center gap-2 md:text-[26px]">
            Uber{" "}
            <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">
              Captain
            </span>
          </h1>

          <form onSubmit={step === 1 ? handleNext : handleSubmit}>
            {step === 1 ? (
              <>
                <h3 className="text-lg font-bold mb-1 text-gray-900 md:text-xl">
                  Get Started
                </h3>
                <p className="text-gray-400 text-[13px] mb-6 leading-tight">
                  Register to start earning with Uber.
                </p>

                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  What's your name?
                </h3>
                <div className="flex gap-3 mb-5">
                  <input
                    required
                    className="bg-[#f2f2f2] w-1/2 rounded-lg px-4 py-2.5 border-none text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <input
                    required
                    className="bg-[#f2f2f2] w-1/2 rounded-lg px-4 py-2.5 border-none text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>

                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Registered Email
                </h3>
                <input
                  required
                  className="bg-[#f2f2f2] mb-5 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <h3 className="text-sm font-semibold mb-2 text-gray-800">
                  Create a Password
                </h3>
                <input
                  required
                  className="bg-[#f2f2f2] mb-6 rounded-lg px-4 py-2.5 border-none w-full text-base placeholder:text-gray-400 outline-none focus:bg-[#ebebeb] transition-all"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button className="bg-black text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base hover:bg-zinc-800 transition-colors">
                  Continue <span>&rarr;</span>
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep(1)}
                    type="button"
                    className="text-blue-600 text-xs font-semibold hover:underline"
                  >
                    ← Back
                  </button>
                  <h3 className="text-lg font-bold text-gray-900 md:text-xl">
                    Vehicle Details
                  </h3>
                </div>

                <div className="flex gap-3 mb-4">
                  <div className="w-1/2">
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      Color
                    </h3>
                    <input
                      required
                      className="bg-[#f2f2f2] w-full rounded-lg px-4 py-2.5 border-none text-base outline-none focus:bg-[#ebebeb] transition-all"
                      type="text"
                      placeholder="e.g. Black"
                      value={vehicleColor}
                      onChange={(e) => setVehicleColor(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      Plate
                    </h3>
                    <input
                      required
                      className="bg-[#f2f2f2] w-full rounded-lg px-4 py-2.5 border-none text-base outline-none focus:bg-[#ebebeb] transition-all"
                      type="text"
                      placeholder="NY-1234"
                      value={vehiclePlate}
                      onChange={(e) => setVehiclePlate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mb-8">
                  <div className="w-1/2">
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      Capacity
                    </h3>
                    <input
                      required
                      className="bg-[#f2f2f2] w-full rounded-lg px-4 py-2.5 border-none text-base outline-none focus:bg-[#ebebeb] transition-all"
                      type="number"
                      placeholder="4"
                      value={vehicleCapacity}
                      onChange={(e) => setVehicleCapacity(e.target.value)}
                    />
                  </div>
                  <div className="w-1/2">
                    <h3 className="text-sm font-semibold mb-2 text-gray-800">
                      Type
                    </h3>
                    <select
                      required
                      className="bg-[#f2f2f2] w-full rounded-lg px-4 py-2.75 border-none text-base outline-none focus:bg-[#ebebeb] transition-all"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <option value="" disabled>
                        Select
                      </option>
                      <option value="car">Car</option>
                      <option value="auto">Auto</option>
                      <option value="motorcycle">Moto</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-[#10b461] text-white font-semibold mb-4 rounded-lg px-4 py-3 w-full text-base hover:bg-[#0e9e55] transition-colors"
                >
                  Create Account
                </button>
              </>
            )}

            <p className="text-center text-[13px] text-gray-500">
              Already driving with us?{" "}
              <Link
                to="/captain-login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </Link>
            </p>
          </form>
        </div>

        <div className="mt-8">
          <p className="text-[11px] text-gray-400 leading-tight text-center">
            By proceeding, you agree to Uber's Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
