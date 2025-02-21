import { Link } from 'react-router-dom';

const Navbar = () => {
  return (

      //  <nav className="navbar navbar-expand-lg bg-body-tertiary">
      //  <div className="container-fluid">
      //   <a className="navbar-brand text-dark fw-bold" href="/">
      //   {/* <img src="/habit logo.png" alt="Logo" width="35" height="35" className="d-inline-block align-text-top"></img> */}
      //   Habit Tracker
      //   </a>
      //    <div className="collapse navbar-collapse">
      //      <ul className="navbar-nav ms-auto">
      //        <li className="nav-item">
      //          <Link className="nav-link" to="/signup">Signup</Link>
      //        </li>
      //        <li className="nav-item">
      //          <Link to="/login" className="btn btn-primary mx-2">Login</Link>
      //        </li>
      //      </ul>
      //    </div>
      //  </div>
      //  </nav> 

        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand text-dark fw-bold" href="/">Habit Tracker</a>
            <div className="d-flex" >
              <Link to="/signup" className="btn btn-outine-dark">Signup</Link>
              <Link to="/login" className="btn btn-primary mx-2">Login</Link>
            </div>
          </div>
        </nav>

       
  );
};

export default Navbar;