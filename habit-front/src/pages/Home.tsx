//src/pages/Home.tsx
// import { Link } from 'react-router-dom';
import Carousal from "../components/Carousal"
import Navbar from '../components/Navbar';
import lapmob from "../assets/lapmob.jpg";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Carousal />
      <div className="container text-center mt-5">
        <img src={lapmob} alt="lap" />
        <br></br>
        {/* <h1>------------------Habit Tracker--------------------</h1>
        <h2>Track your habits, visualize progress, and stay consistent!</h2>
        <p>----------------------------Insert Footer----------------------------</p> 
         <div>
          <Link to="/signup" className="btn btn-primary mx-2 mb-5">Try Now</Link>
          
        </div> */}
        <Footer />
      </div>
    </div>
  );
};

export default Home;