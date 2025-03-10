// src/components/Dashnav.tsx 
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
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    alert("Logging out!");
    window.location.href = "/";
  };

  return (
    <Navbar expand="lg" 
    style={{
      backgroundImage: "url('/images/grad.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
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