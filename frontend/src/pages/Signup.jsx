import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; // React Spinner

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Signup({ setlogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  async function clickHandler() {
    if (!email || !username || !password) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      console.log("SERVER_URL:", SERVER_URL);
      const url = `${SERVER_URL}/api/auth/signup`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const resText = await res.text();
      console.log("Raw Response:", resText);

      let data;
      try {
        data = JSON.parse(resText);
      } catch (error) {
        throw new Error("Invalid JSON response from server");
      }

      if (!res.ok) {
        throw new Error(data?.msg || "Signup failed");
      }

      localStorage.setItem("authToken", data.token);
      setlogin(true);
      toast.success("Signup successful");
      navigate("/");
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(error.message);
      setMsg(error.message);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="flex flex-col w-full sm:w-2/3 md:w-1/2 lg:w-1/3 bg-white shadow-lg p-6 sm:p-10 rounded-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
          Signup
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="border-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value.trim())}
        />

        <input
          type="text"
          placeholder="Enter your username"
          className="border-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500 mt-4"
          onChange={(e) => setUsername(e.target.value.trim())}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="border-2 p-2 rounded-md focus:ring-2 focus:ring-blue-500 mt-4"
          onChange={(e) => setPassword(e.target.value.trim())}
        />

        <button
          className="bg-black text-white py-2 px-4 rounded-md mt-6 hover:bg-gray-900 transition flex items-center justify-center"
          onClick={clickHandler}
          disabled={loading}
        >
          {loading ? <ClipLoader color="#ffffff" size={20} /> : "Signup"}
        </button>

        {msg && <p className="text-center text-red-500 mt-4">{msg}</p>}
      </div>
    </div>
  );
}

export default Signup;
