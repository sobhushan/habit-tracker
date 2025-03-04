// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
// import Dashnav from "../components/Dashnav";

// const Rewards = () => {
//   const [username, setUsername] = useState<string>("");
//   const [points, setPoints] = useState<number>(0);
//   const [highestStreak, setHighestStreak] = useState<number>(0);
//   const [badges, setBadges] = useState<string[]>([]);
//   const [, setSearchTerm] = useState("");

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) setUsername(storedUsername);

//     const userId = localStorage.getItem("user_id");
//     if (!userId) return;

//     // Fetch Rewards Data from API
//     axios
//       .get(`http://localhost:3000/api/rewards?user_id=${userId}`)
//       .then((response) => {
//         const { points, highest_streak, badges } = response.data;
//         setPoints(points);
//         setHighestStreak(highest_streak);
//         setBadges(badges);
//       })
//       .catch((error) => console.error("❌ Error fetching rewards:", error));
//   }, []);

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/wood-texture.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
//         left: 0,
//         right: "0",
//         position: "absolute",
//       }}
//     >
//       <Dashnav setSearchTerm={setSearchTerm} />
//       <Container className="mt-4">
//         <h2 className="text-center mb-4" style={{ color: "#471514" }}>Rewards & Progress</h2>
//         <Row>
//           {/* Left Column - User Info & Points */}
//           <Col md={4}>
//             <Card className="text-center p-3 shadow-lg mb-3">
//               <Card.Body>
//                 <h4>Hello, {username}! 👋</h4>
//                 <p>Keep up the great work!</p>
//                 <h5>🏆 Points: {points}</h5>
//                 <h5>🔥 Highest Streak: {highestStreak} Days</h5>
//               </Card.Body>
//             </Card>
//           </Col>

//           {/* Right Column - Badges */}
//           <Col md={8}>
//             <Card className="text-center p-3 shadow-lg mb-3">
//               <h5>🎖️ Badges Earned</h5>
//               <Row className="d-flex justify-content-center">
//                 {badges.length > 0 ? (
//                   badges.map((badge, index) => (
//                     <Col key={index} md={4} className="mb-3">
//                       <Card className="text-center p-2 shadow">
//                         <Card.Img variant="top" src={`/images/${badge}.png`} alt={badge} />
//                         <Card.Body>
//                           <Card.Title>{badge}</Card.Title>
//                           <Card.Text>Achievement Unlocked!</Card.Text>
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))
//                 ) : (
//                   <p className="mt-3 text-muted">No badges earned yet. Keep going! 🚀</p>
//                 )}
//               </Row>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Rewards;
//========================================================
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card, ProgressBar, Image } from "react-bootstrap";
import "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import Slider from "react-slick";
import Confetti from "react-confetti";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Dashnav from "../components/Dashnav";
import Heatmap from "../components/Heatmap";

interface HabitStatsType {
  topHabit: { title: string; count: number } | null;
  completionRate: number;
  longestStreak: number;
}

const Rewards = () => {
  const [username, setUsername] = useState<string>("");
  const [points, setPoints] = useState<number>(0);
  const [, setHighestStreak] = useState<number>(0);
  const [badges, setBadges] = useState<{ name: string; description: string; image_path: string; habitName?: string }[]>([]);
  const [newBadgeEarned, setNewBadgeEarned] = useState<boolean>(false);
  const [, setSearchTerm] = useState("");

  const [habitStatusData, setHabitStatusData] = useState({
    labels: ["Completed", "Pending"],
    datasets: [{ data: [0, 0], backgroundColor: ["#28a745", "#dc3545"] }],
  });
  const [barData, setBarData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Habits Completed",
        data: [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#17a2b8",
      },
    ],
  });

  const [habitStats, setHabitStats] = useState<HabitStatsType>({
    topHabit: null,
    completionRate: 0,
    longestStreak: 0,
  });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    const user_id = localStorage.getItem("user_id");

    axios
      .get(`http://localhost:3000/api/rewards?user_id=${user_id}`)
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstReward = response.data[0];
          setPoints(firstReward.points || 0);
          setHighestStreak(firstReward.highest_streak || 0);

          const formattedBadges = firstReward.badges.map((badge: any) => ({
            name: badge.name,
            description: badge.description,
            image_path: badge.image_path,
            habitName: firstReward.habit_name || "Unknown Habit",
          }));

          setBadges(formattedBadges);

          // Trigger confetti animation when a new badge is unlocked
          if (formattedBadges.length > badges.length) {
            setNewBadgeEarned(true);
            setTimeout(() => setNewBadgeEarned(false), 3000);
          }
        }
      })
      .catch((error) => console.error("❌ Error fetching rewards:", error));

    // Fetch Donut Chart Data (Completed vs Pending)
    axios
      .get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}`)
      .then((response) => {
        const { completed, pending } = response.data;
        setHabitStatusData({
          labels: ["Completed", "Pending"],
          datasets: [
            {
              data: [completed, pending],
              backgroundColor: ["#28a745", "#dc3545"],
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching habit status:", error));

    // Fetch Bar Chart Data (Weekly Habit Progress)
    axios
      .get(`http://localhost:3000/api/charts/bargraph?user_id=${user_id}`)
      .then((response) => {
        console.log("Bar Graph Data from API:", response.data);
        setBarData({
          labels: response.data.map((item: { date: string }) => item.date),
          datasets: [
            {
              label: "Habits Completed",
              data: response.data.map((item: { count: number }) => item.count),
              backgroundColor: "#17a2b8",
            },
          ],
        });
      })
      .catch((error) =>
        console.error("Error fetching weekly habit data:", error)
      );

      axios
      .get(`http://localhost:3000/api/stats?user_id=${user_id}`)
      .then((response) => {
        console.log("📢 Habit Stats Response:", response.data);
        setHabitStats(response.data); // Make sure to use response.data
      })
      .catch((error) => console.error("❌ Error fetching habit stats:", error));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div style={{ backgroundImage: "url('/images/wood-texture.jpg')", backgroundSize: "cover", backgroundPosition: "center", boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)", left: 0, right: "0", position: "absolute" }}>
      {newBadgeEarned && <Confetti numberOfPieces={200} recycle={false} />}
      <Dashnav setSearchTerm={setSearchTerm} />
      <Container fluid className="mt-4">
        {/* <h2 className="text-center mb-4" style={{ color: "#471514" }}>🎉 Rewards & Progress</h2> */}
        <Row>
          <Col md={5}>

            <Card className="p-3 shadow-lg mb-3" style={{ background: "linear-gradient(135deg, #6a11cb, #2c1852)", borderRadius:"20px" }}>
              <div className="text-center">
                <Image src="/habit logo.png" alt="User" className="rounded-circle mx-auto d-block border-4 border-blue-400 shadow-md" style={{ width: "150px", height: "150px" }} />
                <Card.Body>
                  {/* <h4 className="text-light">Hi, {username}! 👋</h4> */}
                  <h3 className="text-light">🎉Rewards & Progress🎉</h3>
                  <p className="text-light">Keep up the great work, {username}!</p>
                  <Card className="p-3 shadow-lg mb-3 bg-light">
                    <h4 className="text-center mt-3">🏆 Points Earned: <span className="text-primary">{points}</span></h4>
                    <ProgressBar now={points % 100} variant="info" className="my-2" />
                    <p className="text-muted text-center">Earn 100 points to unlock the next reward! 🎯</p>
                  </Card>
                  <Card className="text-center p-3 shadow-lg mb-3"><Heatmap /></Card>
                  <Card className="text-center p-3 shadow-lg mt-3"><h5>Today's Habit Status</h5><Doughnut data={habitStatusData} /></Card>
                </Card.Body>
              </div>
            </Card>
          </Col>

          <Col md={7}>
                        <Card
              className="p-5 shadow-lg mb-4 text-white"
              style={{
                background: "linear-gradient(135deg, #6a11cb, #2575fc)", // Purple-Blue gradient
                borderRadius: "20px",
              }}
            >
              <h5 className="text-center font-weight-bold mb-4 text-white">
                📊 Habit Completion Stats
              </h5>
              <Row className="gap-3 justify-content-center">
                {/* 🏆 Top Completed Habit */}
                <Col md={3} className="text-center">
                  <Card
                    className="p-4 shadow-lg border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)", // Glass effect
                      borderRadius: "15px",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h6 className="text-white">🏆 Top Completed Habit</h6>
                    <p className="font-weight-bold text-2xl text-yellow-300">
                      {habitStats.topHabit ? habitStats.topHabit.title : "No Data"}
                    </p>
                  </Card>
                </Col>

                {/* 📊 Completion Rate */}
                <Col md={3} className="text-center">
                  <Card
                    className="p-4 shadow-lg border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "15px",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h6 className="text-white">📊 Completion Rate</h6>
                    <p className="font-weight-bold text-2xl text-green-300">
                      {habitStats.completionRate}% this month
                    </p>
                  </Card>
                </Col>

                {/* 🔥 Longest Streak */}
                <Col md={3} className="text-center">
                  <Card
                    className="p-4 shadow-lg border-0"
                    style={{
                      background: "rgba(255, 255, 255, 0.15)",
                      borderRadius: "15px",
                      backdropFilter: "blur(10px)",
                      transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0px 10px 20px rgba(0, 0, 0, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <h6 className="text-white">🔥 Longest Streak</h6>
                    <p className="font-weight-bold text-2xl text-orange-300">
                      {habitStats.longestStreak} days
                    </p>
                  </Card>
                </Col>
              </Row>
            </Card>
            
            <Card className="text-center p-4 shadow-lg mt-3 mb-4" style={{ background: "linear-gradient(135deg, #ff758c, #d44df2)", borderRadius: "20px" }}>
              <h5 className="mb-4 text-dark font-weight-bold">🎖️ Badges Earned</h5>
              {badges.length > 0 ? (
                <Slider {...sliderSettings}>
                  {badges.map((badge, index) => (
                    <div key={index}>
                      <Card className="p-3 shadow border-0 mx-2" style={{ borderRadius: "12px", textAlign: "center" }}>
                        <Image src={badge.image_path} alt={badge.name} className="rounded-circle mx-auto d-block" style={{ width: "80px", height: "80px", border: "4px solid gold", padding: "5px" }} />
                        <Card.Body>
                          <Card.Title className="font-weight-bold text-primary">{badge.name}</Card.Title>
                          <Card.Text className="text-muted">{badge.description}</Card.Text>
                          {badge.habitName && <p className="text-secondary small">🏆 Earned for: <i>{badge.habitName}</i></p>}
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </Slider>
              ) : <p className="text-muted">No badges yet. Keep going! 🚀</p>}
            </Card>


            <Card className="text-center p-3 shadow-lg mb-3"
            style={{ borderRadius: "20px" }}
            >
              <h5>Weekly Progress</h5><Bar data={barData} /></Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Rewards;


// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Row, Col, Card, ProgressBar, Image } from "react-bootstrap";
// import Slider from "react-slick";
// import Confetti from "react-confetti";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Dashnav from "../components/Dashnav";
// import Heatmap from "../components/Heatmap";

// const Rewards = () => {
//   const [username, setUsername] = useState<string>("");
//   const [points, setPoints] = useState<number>(0);
//   const [, setHighestStreak] = useState<number>(0);
//   const [badges, setBadges] = useState<{ name: string; description: string; image_path: string; habitName?: string }[]>([]);
//   const [newBadgeEarned, setNewBadgeEarned] = useState<boolean>(false);
//   const [, setSearchTerm] = useState("");

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) setUsername(storedUsername);
//     const user_id = localStorage.getItem("user_id");

//     axios
//       .get(`http://localhost:3000/api/rewards?user_id=${user_id}`)
//       .then((response) => {
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           const firstReward = response.data[0];
//           setPoints(firstReward.points || 0);
//           setHighestStreak(firstReward.highest_streak || 0);

//           const formattedBadges = firstReward.badges.map((badge: any) => ({
//             name: badge.name,
//             description: badge.description,
//             image_path: badge.image_path,
//             habitName: firstReward.habit_name || "Unknown Habit",
//           }));

//           setBadges(formattedBadges);

//           // Trigger confetti animation when a new badge is unlocked
//           if (formattedBadges.length > badges.length) {
//             setNewBadgeEarned(true);
//             setTimeout(() => setNewBadgeEarned(false), 3000);
//           }
//         }
//       })
//       .catch((error) => console.error("❌ Error fetching rewards:", error));
//   }, []);

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div style={{ backgroundImage: "url('/images/wood-texture.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}>
//       {newBadgeEarned && <Confetti numberOfPieces={200} recycle={false} />}
//       <Dashnav setSearchTerm={setSearchTerm} />
//       <Container fluid className="mt-4">
//         <h2 className="text-center mb-4" style={{ color: "#471514" }}>🎉 Rewards & Progress</h2>
//         <Row>
//           <Col md={5}>
//             <Card className="p-3 shadow-lg mb-3" style={{ backgroundColor: "#2c1852" }}>
//               <div className="text-center">
//                 <Image src="/habit logo.png" alt="User" className="rounded-circle mx-auto d-block" style={{ width: "150px", height: "150px" }} />
//                 <Card.Body>
//                   <h4 className="text-light">Hello, {username}! 👋</h4>
//                   <p className="text-light">Keep up the great work!</p>
//                   <Card className="p-3 shadow-lg mb-3 bg-light">
//                     <h4 className="text-center mt-3">🏆 Points Earned: <span className="text-primary">{points}</span></h4>
//                     <ProgressBar now={points % 100} variant="info" className="my-2" />
//                     <p className="text-muted text-center">Earn 100 points to unlock the next reward! 🎯</p>
//                   </Card>
//                   <Card className="text-center p-3 shadow-lg mb-3"><Heatmap /></Card>
//                 </Card.Body>
//               </div>
//             </Card>
//           </Col>

//           <Col md={7}>
//             <Card className="text-center p-4 shadow-lg mt-3" style={{ background: "linear-gradient(135deg, #f3e7e9, #e3eeff)", borderRadius: "15px" }}>
//               <h5 className="mb-4 text-dark font-weight-bold">🎖️ Badges Earned</h5>
//               {badges.length > 0 ? (
//                 <Slider {...sliderSettings}>
//                   {badges.map((badge, index) => (
//                     <div key={index}>
//                       <Card className="p-3 shadow border-0" style={{ borderRadius: "12px", textAlign: "center" }}>
//                         <Image src={badge.image_path} alt={badge.name} className="rounded-circle mx-auto d-block" style={{ width: "80px", height: "80px", border: "4px solid gold", padding: "5px" }} />
//                         <Card.Body>
//                           <Card.Title className="font-weight-bold text-primary">{badge.name}</Card.Title>
//                           <Card.Text className="text-muted">{badge.description}</Card.Text>
//                           {badge.habitName && <p className="text-secondary small">🏆 Earned for: <i>{badge.habitName}</i></p>}
//                         </Card.Body>
//                       </Card>
//                     </div>
//                   ))}
//                 </Slider>
//               ) : (
//                 <p className="text-muted">No badges yet. Keep going! 🚀</p>
//               )}
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Rewards;

//=========================this neeche wakla ==========================
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Row, Col, Card, ProgressBar, Image } from "react-bootstrap";
// import "chart.js/auto";
// import { Bar, Doughnut } from "react-chartjs-2";
// import Dashnav from "../components/Dashnav";
// import Heatmap from "../components/Heatmap";

// const Rewards = () => {
//   const [username, setUsername] = useState<string>("");
//   const [points, setPoints] = useState<number>(0);
//   const [, setHighestStreak] = useState<number>(0);
//   const [badges, setBadges] = useState<string[]>([]);
//   const [, setSearchTerm] = useState("");

//   const [habitStatusData, setHabitStatusData] = useState({
//     labels: ["Completed", "Pending"],
//     datasets: [{ data: [0, 0], backgroundColor: ["#28a745", "#dc3545"] }],
//   });
//   const [barData, setBarData] = useState({
//     labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
//     datasets: [
//       {
//         label: "Habits Completed",
//         data: [0, 0, 0, 0, 0, 0, 0],
//         backgroundColor: "#17a2b8",
//       },
//     ],
//   });

//   useEffect(() => {
//     const storedUsername = localStorage.getItem("username");
//     if (storedUsername) setUsername(storedUsername);
//     const user_id = localStorage.getItem("user_id");

//     axios
//       .get(`http://localhost:3000/api/rewards?user_id=${user_id}`)
//       .then((response) => {
//         if (Array.isArray(response.data) && response.data.length > 0) {
//           const firstReward = response.data[0];
//           setPoints(firstReward.points || 0);
//           setHighestStreak(firstReward.highest_streak || 0);
//           setBadges(firstReward.badges || []);
//         }
//       })
//       .catch((error) => console.error("❌ Error fetching rewards:", error));

//     // Fetch Donut Chart Data (Completed vs Pending)
//     axios
//       .get(`http://localhost:3000/api/charts/donutchart?user_id=${user_id}`)
//       .then((response) => {
//         const { completed, pending } = response.data;
//         setHabitStatusData({
//           labels: ["Completed", "Pending"],
//           datasets: [
//             {
//               data: [completed, pending],
//               backgroundColor: ["#28a745", "#dc3545"],
//             },
//           ],
//         });
//       })
//       .catch((error) => console.error("Error fetching habit status:", error));

//     // Fetch Bar Chart Data (Weekly Habit Progress)
//     axios
//       .get(`http://localhost:3000/api/charts/bargraph?user_id=${user_id}`)
//       .then((response) => {
//         console.log("Bar Graph Data from API:", response.data);
//         setBarData({
//           labels: response.data.map((item: { date: string }) => item.date),
//           datasets: [
//             {
//               label: "Habits Completed",
//               data: response.data.map((item: { count: number }) => item.count),
//               backgroundColor: "#17a2b8",
//             },
//           ],
//         });
//       })
//       .catch((error) =>
//         console.error("Error fetching weekly habit data:", error)
//       );
//   }, []);

//   return (
//     <div
//       style={{
//         backgroundImage: "url('/images/wood-texture.jpg')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.2)",
//         left: 0,
//         right: "0",
//         position: "absolute",
//       }}
//     >
//       <Dashnav setSearchTerm={setSearchTerm} />
//       <Container fluid className="mt-4">
//         <h2 className="text-center mb-4" style={{ color: "#471514" }}>
//           🎉 Rewards & Progress
//         </h2>
//         <Row>
//           <Col md={5}>
//             <Card className="p-3 shadow-lg mb-3"
//             style={{ backgroundColor: "#2c1852" }}>
//               <div className="text-center">
//                 <Image
//                   src="/habit logo.png"
//                   alt="User"
//                   className="rounded-circle mx-auto d-block border-4 border-blue-400 shadow-md"
//                   style={{ width: "150px", height: "150px" }}
//                 />
//                 <Card.Body>
//                   <h4 className="text-light">Hello, {username}! 👋</h4>
//                   <p className="text-light">Keep up the great work!</p>
//                   <Card className="p-3 shadow-lg mb-3 bg-light">
//                     <h4 className="text-center mt-3">
//                       🏆 Points Earned: <span className="text-primary">{points}</span>
//                     </h4>
//                     <div style={{ position: "relative", width: "100%" }}>
//                       <ProgressBar now={points % 100} variant="info" className="my-2" />
//                       <span
//                         style={{
//                           position: "absolute",
//                           width: "100%",
//                           textAlign: "center",
//                           top: "50%",
//                           left: "50%",
//                           transform: "translate(-50%, -50%)",
//                           color: "#000",
//                         }}
//                       >
//                         {points % 100}/100
//                       </span>
//                     </div>
//                     <p className="text-muted text-center">Earn 100 points to unlock the next reward! 🎯</p>
//                   </Card>
//                   <Card className="text-center p-3 shadow-lg mb-3">
//                     <Heatmap />
//                   </Card>
//                   <Card className="text-center p-3 shadow-lg mt-3">
//                     <h5>Today's Habit Status</h5>
//                     <Doughnut data={habitStatusData} />
//                   </Card>
//                 </Card.Body>
//               </div>
//             </Card>

//           </Col>

//           <Col md={7}>
//             <Card className="text-center p-3 shadow-lg mb-3">
//               <h5>Weekly Progress</h5>
//               <Bar data={barData} />
//             </Card>
//             <Card className="text-center p-3 shadow-lg mt-3 bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg">
//               <h5>🎖️ Badges Earned</h5>
//               <Row className="d-flex justify-content-center">
//                 {badges.length > 0 ? (
//                   badges.map((badge, index) => (
//                     <Col key={index} md={4} className="mb-3">
//                       <Card className="text-center p-2 shadow">
//                         <Card.Img variant="top" src={`/images/${badge}.png`} alt={badge} />
//                         <Card.Body>
//                           <Card.Title>{badge}</Card.Title>
//                           {/* <Card.Text>Complete 5 habits in a row</Card.Text> */}
//                         </Card.Body>
//                       </Card>
//                     </Col>
//                   ))
//                 ) : (
//                   <p>No badges yet. Keep going! 🚀</p>
//                 )}
//               </Row>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default Rewards;



