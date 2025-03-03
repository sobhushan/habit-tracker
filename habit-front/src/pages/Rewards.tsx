//src/pages/Rewards.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import Dashnav from "../components/Dashnav";
import Heatmap from "../components/Heatmap";

const Rewards = () => {
  const [username, setUsername] = useState<string>("");
  const [habitStatusData, setHabitStatusData] = useState({
    labels: ["Completed", "Pending"],
    datasets: [{ data: [0, 0], backgroundColor: ["#28a745", "#dc3545"] }],
  });

  const [pieData, setPieData] = useState<{ labels: string[]; datasets: { data: number[]; backgroundColor: string[] }[] }>({
    labels: [],
    datasets: [{ data: [], backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6f42c1", "#fd7e14", "#20c997", "#6c757d"] }],
  });

  const [barData, setBarData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ label: "Habits Completed", data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: "#17a2b8" }],
  });

  const [, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch username from local storage
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    const user_id = localStorage.getItem("user_id");

    // Fetch Pie Chart Data (Habit Categories)
    axios.get(`http://localhost:3000/api/charts/piechart?user_id=${user_id}`)
      .then((response) => {
        const data = response.data;
        setPieData({
          labels: Object.keys(data) as string[],
          datasets: [{ data: Object.values(data) as number[], backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545", "#17a2b8", "#6f42c1", "#fd7e14", "#20c997", "#6c757d"] }],
        });
      })
      .catch((error) => console.error("Error fetching category data:", error));

    // Fetch Donut Chart Data (Completed vs Pending)
    axios.get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}`)
      .then((response) => {
        const { completed, pending } = response.data;
        setHabitStatusData({
          labels: ["Completed", "Pending"],
          datasets: [{ data: [completed, pending], backgroundColor: ["#28a745", "#dc3545"] }],
        });
      })
      .catch((error) => console.error("Error fetching habit status:", error));

    // Fetch Bar Chart Data (Weekly Habit Progress)
    axios.get(`http://localhost:3000/api/charts/bargraph?user_id=${user_id}`)
      .then((response) => {
        console.log("Bar Graph Data from API:", response.data); // Debugging API response
        setBarData({
          labels: response.data.map((item: { date: string }) => item.date), // Use API dates
          datasets: [
            {
              label: "Habits Completed",
              data: response.data.map((item: { count: number }) => item.count), // Extract counts
              backgroundColor: "#17a2b8",
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching weekly habit data:", error));
  }, []);

  return (
    <div 
    style={{
      backgroundImage: "url('/images/wood-texture.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      // border: "2px solid #8B4513",
      boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)"
    }}>
      <Dashnav setSearchTerm={setSearchTerm}/>
      <Container className="mt-4">
        <h2 className="text-center mb-4" style={{color: "#471514"}}>Rewards & Progress</h2>
        <Row>
          {/* Left Column - User Card + Donut Chart */}
          <Col md={4}>
            <Card className="text-center p-3 shadow-lg mb-3 ">
              <Card.Body>
                <h4>Hello, {username}! 👋</h4>
                <p>Keep up the great work!</p>
                <h5>Today's Habit Status</h5>
                <Doughnut data={habitStatusData} />
              </Card.Body>
            </Card>
            <Card className="text-center p-3 shadow-lg">
              <h5>Habit Categories</h5>
              <Pie data={pieData} />
            </Card>
          </Col>

          {/* Right Column - Bar Chart, Heatmap, and Badges */}
          <Col md={8}>
            <Row>
              <Col md={12}>
                <Card className="text-center p-3 shadow-lg mb-3">
                  <h5>Weekly Progress</h5>
                  <Bar data={barData} />
                </Card>
              </Col>
              <Col md={12}>
                <Card className="text-center p-3 shadow-lg mb-3">
                  <Heatmap />
                </Card>
              </Col>
              <Col md={12}>
                <Card className="text-center p-3 shadow-lg mb-3 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg">
                  <h5>🎖️ Badges Earned</h5>
                  <Row className="d-flex justify-content-center">
                    <Col md={4} className="mb-3">
                      <Card className="text-center p-2 shadow">
                        <Card.Img variant="top" src="/images/badge1.png" alt="Bronze Badge" />
                        <Card.Body>
                          <Card.Title>Bronze Streak</Card.Title>
                          <Card.Text>Complete 5 habits in a row</Card.Text>
                          <ProgressBar now={40} variant="warning" label={`40%`} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="text-center p-2 shadow">
                        <Card.Img variant="top" src="/images/badge2.png" alt="Silver Badge" />
                        <Card.Body>
                          <Card.Title>Silver Streak</Card.Title>
                          <Card.Text>Complete 10 habits in a row</Card.Text>
                          <ProgressBar now={60} variant="info" label={`60%`} />
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="mb-3">
                      <Card className="text-center p-2 shadow">
                        <Card.Img variant="top" src="/images/badge3.png" alt="Gold Badge" />
                        <Card.Body>
                          <Card.Title>Gold Streak</Card.Title>
                          <Card.Text>Complete 20 habits in a row</Card.Text>
                          <ProgressBar now={80} variant="success" label={`80%`} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <p className="mt-3 text-muted">
                    🌟 Keep pushing forward! Every small step adds up to big achievements! 🚀
                  </p>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Rewards;





//=====================================================================================



