import React from "react";
import { FaLongArrowAltRight } from "react-icons/fa";

const ResourceCard = ({ department, year, link }) => {
  return (
    <div className=" md:w-96 w-full mx-auto bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out">
      {/* Header Section with Gradient Background */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 className="text-xl md:text-2xl font-bold">{department}</h1>
        <h2 className="text-sm md:text-lg text-gray-200">{year}</h2>
      </div>

      {/* Link Section */}
      <div className="px-6 py-4">
        <a
          href={link}
          className="text-indigo-500 hover:text-indigo-700 font-semibold text-md md:text-lg"
          target="_blank"
          rel="noopener noreferrer"
        >
          See Docs <FaLongArrowAltRight />
        </a>
      </div>
    </div>
  );
};

export default ResourceCard;