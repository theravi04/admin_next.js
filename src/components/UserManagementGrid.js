"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const UserManagementGrid = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []); // Dependency array ensures this runs only once

  const fetchUsers = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get("http://localhost:5000/api/users/getUsers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Filter users to include only clients
      const clientUsers = response.data.filter((user) => user.role === "client");
      setUsers(clientUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const toggleWalletFreeze = async (userId, currentStatus) => {
    const token = Cookies.get("token");
    try {
      // Toggle status: if currently true, set to false and vice versa
      const newStatus = !currentStatus;
  
      const response = await axios.post(
        "http://localhost:5000/api/users/walletStatus",
        { userId, walletStatus: newStatus }, // Pass new wallet status
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(response);
  
      // Update local state to reflect changes
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, walletFrozen: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error toggling wallet status:", error);
    }
  };
  
  const toggleAccountFreeze = async (userId, currentStatus) => {
    const token = Cookies.get("token");
    try {
      // Toggle status: if currently true, set to false and vice versa
      const newStatus = !currentStatus;
  
      const response = await axios.post(
        "http://localhost:5000/api/users/accountStatus",
        { userId, accountStatus: newStatus }, // Pass new account status
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log(response);
  
      // Update local state to reflect changes
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, accountFrozen: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error toggling account status:", error);
    }
  };
  

  const resetCredentials = (userId) => {
    alert(`Resetting credentials for user ${userId}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto border border-gray-200 rounded-lg shadow-md mt-8">
      {/* Header */}
      <div className="grid grid-cols-3 bg-gray-200 p-3 rounded-t-lg font-bold text-black">
        <div>Username</div>
        <div>Email</div>
        <div className="text-center">Actions</div>
      </div>

      {/* User Grid */}
      <div className="divide-y divide-gray-300">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-3 items-center p-3 hover:bg-gray-50 transition text-black"
          >
            {/* Username */}
            <div>{user.username}</div>

            {/* Email */}
            <div>{user.email}</div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2">
              {/* Wallet Freeze/Unfreeze Button */}
              <button
                onClick={() => toggleWalletFreeze(user.id)}
                className={`px-3 py-1 text-sm rounded ${
                  user.walletFrozen
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                {user.walletFrozen ? "Unfreeze Wallet" : "Freeze Wallet"}
              </button>

              {/* Account Freeze/Unfreeze Button */}
              <button
                onClick={() => toggleAccountFreeze(user.id)}
                className={`px-3 py-1 text-sm rounded ${
                  user.accountFrozen
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
              >
                {user.accountFrozen ? "Unfreeze Account" : "Freeze Account"}
              </button>

              {/* Reset Credentials Button */}
              <button
                onClick={() => resetCredentials(user.id)}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Reset Credentials
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagementGrid;
