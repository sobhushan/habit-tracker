//src/pages/Home.tsx
// // import { Link } from 'react-router-dom';
// import Carousal from "../components/Carousal"
// import Navbar from '../components/Navbar';
// import homelap  from "../assets/homelap.png";
// import Footer from "../components/Footer";

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <Carousal />
//       <div className="container text-center mt-5">
//         <img src={homelap} alt="lap" style={{ marginLeft: "25px" }}/>
//         <br></br>
//         {/* <h1>------------------Habit Tracker--------------------</h1>
//         <h2>Track your habits, visualize progress, and stay consistent!</h2>
//         <p>----------------------------Insert Footer----------------------------</p> 
//          <div>
//           <Link to="/signup" className="btn btn-primary mx-2 mb-5">Try Now</Link>
          
//         </div> */}
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Home;

// ===============================================================================
// import Carousal from "../components/Carousal";
// import Navbar from "../components/Navbar";
// import homelap from "../assets/homelap.png";
// import Footer from "../components/Footer";

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <Carousal />
//       <div className="container text-center mt-5">
//         <h1 className="fw-bold text-primary">Welcome to Habit Tracker</h1>
//         <p className="lead text-secondary mt-3">
//           Build positive habits, stay consistent, and track your progress effortlessly. 
//           Our Habit Tracker app helps you set goals, monitor achievements, and stay 
//           motivated every step of the way.
//         </p>
//         <img src={homelap} alt="lap" style={{ marginTop: "20px", marginBottom: "20px", width: "70%" }} />
//         <h2 className="fw-bold text-dark">Why Choose Habit Tracker?</h2>
//         <ul className="list-unstyled text-secondary mt-3">
//           <li>✔ Track daily, weekly, and monthly progress</li>
//           <li>✔ Set reminders and stay consistent</li>
//           <li>✔ Visualize your achievements with progress charts</li>
//           <li>✔ Easy-to-use and completely free!</li>
//         </ul>
//         <div className="mt-4">
//           <a href="/signup" className="btn btn-primary btn-lg">Get Started</a>
//         </div>
//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Home;
// ==================================================================================================

// import { motion } from "framer-motion";
// import { CheckCircle, BarChart3, Repeat, Clock } from "lucide-react";
// import Carousal from "../components/Carousal";
// import Navbar from "../components/Navbar";
// import homelap from "../assets/homelap.png";
// import Footer from "../components/Footer";
// import { LucideIcon } from "lucide-react";

// interface FeatureItemProps {
//   icon: LucideIcon;
//   text: string;
// }

// const Home = () => {
//   return (
//     <div>
//       <Navbar />
//       <Carousal />
      
//       <div className="container mt-5 flex flex-col md:flex-row items-center gap-10">
//         {/* Image Section */}
//         <motion.img 
//           src={homelap} 
//           alt="lap" 
//           className="w-full md:w-1/2"
//           initial={{ opacity: 0, x: -50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//         />

//         {/* Features Section */}
//         <motion.div 
//           className="md:w-1/2 text-left"
//           initial={{ opacity: 0, x: 50 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.8 }}
//         >
//           <h1 className="text-3xl font-bold text-blue-900">Stay on Track with Habit Tracker</h1>
//           <p className="text-gray-700 mt-3">
//             Build better habits, track your progress, and stay motivated with our intuitive and engaging habit tracker.
//           </p>

//           {/* Features List */}
//           <div className="mt-5 space-y-4">
//             <FeatureItem icon={CheckCircle} text="Track Your Daily Habits Easily" />
//             <FeatureItem icon={BarChart3} text="Visualize Your Progress with Analytics" />
//             <FeatureItem icon={Repeat} text="Build Lasting Routines with Smart Reminders" />
//             <FeatureItem icon={Clock} text="Stay Consistent with Weekly Goals" />
//           </div>
//         </motion.div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// // Reusable Feature Item Component
// const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, text }) => (
//   <motion.div 
//     className="flex items-center gap-3 text-lg text-gray-800"
//     whileHover={{ scale: 1.05 }}
//   >
//     <Icon className="text-blue-900 w-6 h-6" />
//     <span>{text}</span>
//   </motion.div>
// );

// export default Home;

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { CheckCircle, BarChart3, Repeat, Clock } from "lucide-react";
import Carousal from "../components/Carousal";
import Navbar from "../components/Navbar";
import homelap from "../assets/homelap.png";
import Footer from "../components/Footer";

const Home = () => {
  // Intersection Observer Hook
  const { ref: imageRef, inView: imageInView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const { ref: textRef, inView: textInView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <div>
      <Navbar />
      <Carousal />

      {/* Container Section */}
      <div className="container mt-5 flex flex-col md:flex-row items-center gap-10">
        {/* Image Section */}
        <motion.img
          ref={imageRef}
          src={homelap}
          alt="lap"
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -50 }}
          animate={imageInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        />

        {/* Features Section */}
        <motion.div
          ref={textRef}
          className="md:w-1/2 text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={textInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl font-bold text-blue-900">Stay on Track with Habit Tracker</h1>
          <p className="text-gray-700 mt-3">
            Build better habits, track your progress, and stay motivated with our intuitive and engaging habit tracker.
          </p>

          {/* Features List */}
          <div className="mt-5 space-y-4">
            <FeatureItem icon={CheckCircle} text="Track Your Daily Habits Easily" />
            <FeatureItem icon={BarChart3} text="Visualize Your Progress with Analytics" />
            <FeatureItem icon={Repeat} text="Build Lasting Routines with Smart Reminders" />
            <FeatureItem icon={Clock} text="Stay Consistent with Weekly Goals" />
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

// Reusable Feature Item Component
import { LucideIcon } from "lucide-react";

interface FeatureItemProps {
  icon: LucideIcon;
  text: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon: Icon, text }) => (
  <motion.div className="flex items-center gap-3 text-lg text-gray-800" whileHover={{ scale: 1.05 }}>
    <Icon className="text-blue-900 w-6 h-6" />
    <span>{text}</span>
  </motion.div>
);

export default Home;

