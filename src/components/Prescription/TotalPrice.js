import React from "react";

const TotalPrice = ({ totalPrice }) => {
  return (
    <div className="mt-6 text-right">
      <p className="text-sm text-gray-500">Total Price:</p>
      <p className="text-lg font-semibold">{totalPrice} VND</p>
    </div>
  );
};

export default TotalPrice;
