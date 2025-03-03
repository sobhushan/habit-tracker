// src/components/Footer.tsx

// src/components/Footer.tsx
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer 
  className="container-fluid bg-blue-900 text-white py-4" 
  style={{
    position: "absolute",
    left:"0",
    width: "100%",
  }}
>
      <div className="container mb-5 mt-3">
        <div className="row align-items-center text-center text-md-start mx-2">
          
          {/* Left Section */}
          <div className="col-md-4 mb-3 mb-md-0">
            <h2 className="text-2xl font-semibold">Habit Tracker</h2>
            <p className="text-light">Track your habits and stay productive!</p>
          </div>

          {/* Middle Section - Quick Links */}
          <div className="col-md-4 d-flex justify-content-center gap-4">
            <a href="#" className="text-white text-decoration-none">Home</a>
            <a href="#" className="text-white text-decoration-none">Dashboard</a>
            <a href="#" className="text-white text-decoration-none">About</a>
            <a href="#" className="text-white text-decoration-none">Contact</a>
          </div>

          {/* Right Section - Social Media */}
          <div className="col-md-4 d-flex justify-content-center justify-content-md-end gap-3">
            <a href="#" className="text-light fs-4"><FaFacebook /></a>
            <a href="#" className="text-light fs-4"><FaTwitter /></a>
            <a href="#" className="text-light fs-4"><FaInstagram /></a>
            <a href="#" className="text-light fs-4"><FaLinkedin /></a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-light mt-3 small">
          © {new Date().getFullYear()} Habit Tracker. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;


// =========================================================================================================
//=========Tailwind Styling=================================================================================
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

// const Footer = () => {
//   return (
//     <footer className="  bg-blue-900 text-white py-6 px-4 d-block w-full">
//       <div className="w-full flex flex-col md:flex-row justify-between items-center text-center md:text-left">

        
//         {/* Left Section */}
//         <div className="mb-4 md:mb-0">
//           <h2 className="text-2xl font-semibold">Habit Tracker</h2>
//           <p className="text-sm text-blue-300">Track your habits and stay productive!</p>
//         </div>

//         {/* Middle Section - Quick Links */}
//         <div className="flex space-x-6 text-sm">
//           <a href="#" className="hover:text-blue-400">Home</a>
//           <a href="#" className="hover:text-blue-400">Dashboard</a>
//           <a href="#" className="hover:text-blue-400">About</a>
//           <a href="#" className="hover:text-blue-400">Contact</a>
//         </div>

//         {/* Right Section - Social Media */}
//         <div className="flex space-x-4 mt-4 md:mt-0">
//           <a href="#" className="text-blue-400 hover:text-white text-xl"><FaFacebook /></a>
//           <a href="#" className="text-blue-400 hover:text-white text-xl"><FaTwitter /></a>
//           <a href="#" className="text-blue-400 hover:text-white text-xl"><FaInstagram /></a>
//           <a href="#" className="text-blue-400 hover:text-white text-xl"><FaLinkedin /></a>
//         </div>
//       </div>

//       {/* Copyright */}
//       <div className="mt-6 text-center text-blue-300 text-sm">
//         © {new Date().getFullYear()} Habit Tracker. All rights reserved.
//       </div>
//     </footer>
//   );
// };

// export default Footer;


