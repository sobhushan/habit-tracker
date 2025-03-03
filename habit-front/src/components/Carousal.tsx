// import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import car1 from "../assets/car1.png";
import car2 from "../assets/car2.jpg";
import car3 from "../assets/car3.png";

const Carousal = () => {
  return (
    <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
      <div className="carousel-inner" >
        <div className="carousel-item active" data-bs-interval="1500">
          <img src={car1} className="d-block w-100 opacity-50" alt="Slide 1" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="hab">Habit Tracker</h1>
            <p className="wor">Track your habits</p>
            <Link to="/signup" className="btn btn-light btn-lg mx-2">Let's Get Started</Link>
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="1500">
          {/* <img src={carousal1} style={{ width: '1200px', height: '500px', objectFit: 'cover' }} className="d-block w-100" alt="Slide 2" /> */}
          {/* <img src="https://picsum.photos/1200/500?blur=8&random=2" className="d-block w-100" alt="Slide 2" /> */}
          <img src={car2} className="d-block w-100 opacity-50" alt="Slide 2" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="hab">Habit Tracker</h1>
            <p className="wor">Visualize Progress</p>
            <Link to="/signup" className="btn btn-light btn-lg mx-2">Let's Get Started</Link>
          </div>
        </div>
        <div className="carousel-item" data-bs-interval="1500">
          <img src={car3} className="d-block w-100 opacity-50" alt="Slide 3" />
          <div className="carousel-caption d-none d-md-block">
            <h1 className="hab">Habit Tracker</h1>
            <p className="wor">Stay Consistent</p>
            <Link to="/signup" className="btn btn-light btn-lg mx-2">Let's Get Started </Link>
          </div>
        </div>
      </div>

      <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousal;
