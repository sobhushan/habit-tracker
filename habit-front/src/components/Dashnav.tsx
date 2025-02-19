import { Link } from "react-router-dom";

const Dashnav = () => {
  return (
    <div>
        <nav
        className="navbar navbar-expand-lg" //bg-body-tertiary
        style={{
        //   position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor:"rgb(184, 224, 234)",
          // backgroundColor: "rgba(255, 255, 255, 0.3)", // Transparent White
          // backdropFilter: "blur(8px)", // Glassmorphism Effect
          // zIndex: 10,
        
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-dark fw-bold" to="/">
            Habit Tracker
          </Link>
          <Link className="nav-link" to="/">Signout</Link>
          <div className="collapse navbar-collapse">
           <ul className="navbar-nav ms-auto">
             {/* <li className="nav-item">
               <Link className="nav-link" to="/">Signout</Link>
             </li> */}
             <button className="btn btn-outline-light">Signout</button>
           </ul>
         </div>
        </div>
      </nav>
    </div>
  )
}

export default Dashnav;