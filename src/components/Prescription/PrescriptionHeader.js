import React from "react";

const PrescriptionHeader = ({ doctor, patient, date }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Doctor:</p>
          <p className="text-lg font-medium">{doctor?.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Patient:</p>
          <p className="text-lg font-medium">{patient?.name}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500">Date:</p>
        <p className="text-lg font-medium">{new Date(date).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PrescriptionHeader;
