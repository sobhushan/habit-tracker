// src/components/Footer.tsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 px-4 max-w-full">
      <div className=" max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-center md:text-left">
        
        {/* Left Section */}
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-semibold">Habit Tracker</h2>
          <p className="text-sm text-blue-300">Track your habits and stay productive!</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="flex space-x-6 text-sm">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">Dashboard</a>
          <a href="#" className="hover:text-blue-400">About</a>
          <a href="#" className="hover:text-blue-400">Contact</a>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="text-blue-400 hover:text-white text-xl"><FaFacebook /></a>
          <a href="#" className="text-blue-400 hover:text-white text-xl"><FaTwitter /></a>
          <a href="#" className="text-blue-400 hover:text-white text-xl"><FaInstagram /></a>
          <a href="#" className="text-blue-400 hover:text-white text-xl"><FaLinkedin /></a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-6 text-center text-blue-300 text-sm">
        © {new Date().getFullYear()} Habit Tracker. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;


