import React from "react";

const NoDataFound = () => {
  return (
    <div className="flex justify-center items-center p-5 bg-base-200 rounded-md shadow-md mt-5">
      <div className="text-center">
        <p className="text-lg text-gray-600">No data found</p>
      </div>
    </div>
  );
};

export default NoDataFound;
