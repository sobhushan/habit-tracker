// src/components/Dashnav.tsx 
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Navbar, Form, FormControl, Button, Dropdown } from "react-bootstrap";

// const Dashnav = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log("Search:", searchTerm);
//     // TODO: Implement search functionality
//   };

//   return (
//     <Navbar expand="lg" style={{ backgroundColor: "rgb(184, 224, 234)", padding: "10px" }}>
//       <div className="container-fluid">
//         {/* Brand Logo */}
//         <Link className="navbar-brand text-dark fw-bold" to="/">
//           Habit Tracker
//         </Link>

//         {location.pathname === "/dashboard" && (
//           <Form className="d-flex ms-auto me-3" onSubmit={handleSearchSubmit}>
//             <FormControl
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <Button variant="outline-dark" type="submit">
//               Search
//             </Button>
//           </Form>
//         )}

//         {/* Dropdown Menu */}
//         <Dropdown>
//           <Dropdown.Toggle variant="outline-dark">
//             ☰
//           </Dropdown.Toggle>

//           <Dropdown.Menu align="end">
//             <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
//             <Dropdown.Item as={Link} to="/statistics">Statistics</Dropdown.Item>
//             <Dropdown.Item as={Link} to="/rewards">Rewards</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item className="material-symbols-outlined" as={Link} to="/">logout</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>
//     </Navbar>
//   );
// };

// export default Dashnav;


//=========================================================================
// import { Link } from "react-router-dom";

// const Dashnav = () => {
//   return (
//     <div>
//         <nav
//         className="navbar navbar-expand-lg" //bg-body-tertiary
//         style={{
//         //   position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           backgroundColor:"rgb(184, 224, 234)",
//           // backgroundColor: "rgba(255, 255, 255, 0.3)", // Transparent White
//           // backdropFilter: "blur(8px)", // Glassmorphism Effect
//           // zIndex: 10,
        
//         }}
//       >
//         <div className="container-fluid">
//           <Link className="navbar-brand text-dark fw-bold" to="/">
//             Habit Tracker
//           </Link>
//         <div className="d-flex">
//         <Link to="/dashboard" className="btn btn-outine-dark">Dashboard</Link>
//         <Link to="/" className="btn btn-outine-dark">Logout</Link>
//         </div>
          
//         </div>
//       </nav>
//     </div>
//   )
// }

// export default Dashnav;


//================================================================================
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { Navbar, Form, FormControl, Button, Dropdown } from "react-bootstrap";

// const Dashnav = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearchSubmit = (event: React.FormEvent) => {
//     event.preventDefault();
//     console.log("Search:", searchTerm);
//     // TODO: Implement search functionality
//   };

//   return (
//     <Navbar expand="lg" style={{ backgroundColor: "rgb(184, 224, 234)", padding: "10px" }}>
//       <div className="container-fluid">
//         {/* Brand Logo */}
//         <Link className="navbar-brand text-dark fw-bold" to="/">
//           Habit Tracker
//         </Link>

//         {/* Search Bar */}
//         <Form className="d-flex ms-auto me-3" onSubmit={handleSearchSubmit}>
//           <FormControl
//             type="search"
//             placeholder="Search"
//             className="me-2"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           <Button variant="outline-dark" type="submit">Search</Button>
//         </Form>

//         {/* Dropdown Menu */}
//         <Dropdown>
//           <Dropdown.Toggle variant="outline-dark">
//             ☰
//           </Dropdown.Toggle>

//           <Dropdown.Menu align="end">
//             <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
//             <Dropdown.Item as={Link} to="/statistics">Statistics</Dropdown.Item>
//             <Dropdown.Item as={Link} to="/rewards">Rewards</Dropdown.Item>
//             <Dropdown.Divider />
//             <Dropdown.Item as={Link} to="/">Logout</Dropdown.Item>
//           </Dropdown.Menu>
//         </Dropdown>
//       </div>
//     </Navbar>
//   );
// };

// export default Dashnav;

///============================================
import { Link } from "react-router-dom";
import { Navbar, Form, FormControl, Dropdown, Button } from "react-bootstrap";

interface DashnavProps {
  setSearchTerm: (term: string) => void;
}

const Dashnav: React.FC<DashnavProps> = ({ setSearchTerm }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    alert("Logging out!");
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" 
    // style={{ backgroundColor: "rgb(184, 224, 234)", padding: "10px" }}
    style={{
      backgroundImage: "url('/images/grad.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      // border: "2px solid #8B4513",
      // boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
      // position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(8px)",
      zIndex: 10,
    }}
    >
      <div className="container-fluid">
        {/* Brand Logo */}
        <Link className="navbar-brand text-dark fw-bold" to="/dashboard">
          Habit Tracker
        </Link>

        {/* Search Bar */}
        {location.pathname === "/dashboard" && (
          <Form className="d-flex ms-auto me-3">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              onChange={handleSearchChange}
            />
          </Form>
        )}

        {/* Dropdown Menu */}
        <Dropdown>
          <Dropdown.Toggle variant="outline-light">
            ☰
          </Dropdown.Toggle>

          <Dropdown.Menu align="end">
            <Dropdown.Item as={Link} to="/dashboard">Dashboard</Dropdown.Item>
            <Dropdown.Item as={Link} to="/statistics">Statistics</Dropdown.Item>
            <Dropdown.Item as={Link} to="/rewards">Rewards</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item as={Button} onClick={handleLogout}>
              <span className="material-symbols-outlined">logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Dashnav;


