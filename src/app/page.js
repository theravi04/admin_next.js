"use client";
import React, { useState } from "react";
import UserManagementGrid from "../components/UserManagementGrid";
import Cookies from "js-cookie";
export default function Home() {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
  
      const data = await response.json();
      console.log("Response Data:", data); // Debugging log
  
      if (response.ok && data.token) {
        Cookies.set("token", data.token, { expires: 1 }); // Store the token
        alert("Login successful");
  
        if (data.user?.id) console.log("User ID:", data.user.id); // Optional check
        setIsLoggedIn(true);
        setShowLogin(false);
        setLoginEmail("");
        setLoginPassword("");
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  
  

  const handleRegister = async (e) => {
    e.preventDefault();

    const adminData = {
      username: registerUsername,
      email: registerEmail,
      password: registerPassword,
      role: "admin",
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful! Please log in.");
        setShowRegister(false); // Close popup
        setRegisterUsername("");
        setRegisterEmail("");
        setRegisterPassword("");
      } else {
        // Handle errors returned from the server
        alert(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred. Please try again later.");
    }
  };
  const handleLogout = async () => {
    try {
      // Remove the token from cookies
      Cookies.remove('token');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-purple-700 p-4 text-white flex justify-between">
        <div className="text-xl font-bold">Admin Dashboard</div>
        <div>
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-white text-purple-700 px-3 py-1 rounded mr-2 hover:bg-gray-200"
              >
                Login
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="bg-white text-purple-700 px-3 py-1 rounded hover:bg-gray-200"
              >
                Register
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-white text-purple-700 px-3 py-1 rounded hover:bg-gray-200"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold text-purple-700 mb-4">
          Welcome to the Admin Dashboard
        </h1>
        {isLoggedIn ? (
          <UserManagementGrid />
        ) : (
          <p className="text-gray-600">Please log in to access the dashboard</p>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-gray-500 py-4">
        © {new Date().getFullYear()} Admin Dashboard. All Rights Reserved.
      </footer>

      {/* Login Popup */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Login</h2>
            <form onSubmit={handleLogin} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="text-black w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="text-black block text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="text-black w-full border p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
              >
                Login
              </button>
            </form>
            <button
              onClick={() => setShowLogin(false)}
              className="mt-4 text-black text-sm hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Register Popup */}
      {showRegister && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-black">Register</h2>
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-black">
                  Username
                </label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  required
                  className="text-black w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  required
                  className="text-black w-full border p-2 rounded"
                />
              </div>
              <div>
                <label className="text-black block text-sm font-medium text-black">
                  Password
                </label>
                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  required
                  className="text-black w-full border p-2 rounded"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-800"
              >
                Register
              </button>
            </form>
            <button
              onClick={() => setShowRegister(false)}
              className="mt-4 text-black text-sm hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
