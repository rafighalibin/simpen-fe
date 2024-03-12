import React from "react";

export default function App() {
  return (
    <div className="flex flex-wrap justify-center">
      <div className="m-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <p className="text-3xl font-bold">1050</p>
      </div>
      <div className="m-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Orders</h2>
        <p className="text-3xl font-bold">750</p>
      </div>
      <div className="m-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Revenue</h2>
        <p className="text-3xl font-bold">$15,000</p>
      </div>
      <div className="m-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Products</h2>
        <p className="text-3xl font-bold">250</p>
      </div>
    </div>
  );
}
