#  Habit Tracker

The **Habit Tracker** is a web application designed to help users build and maintain daily habits through a structured tracking system. Users can log their habits, view progress statistics, earn rewards, and maintain streaks for motivation.


## Features
- **User Authentication** (JWT-based login system)  
- **Habit Tracking** (Create, update, delete, and complete habits)  
- **Streak Management** (Tracks longest streaks, top completed habits, and completion rates)  
- **Reward System** (Earn badges and points for completing habits)  
- **Data Visualization** (Heatmaps, donut charts for progress tracking)  
- **Responsive and Interactive UI** (Styled with CSS, Bootstrap, and Tailwind)  


## 🛠 Tech Stack

### **Frontend** (Port: `5134`)  
-  **React** (Vite + TypeScript)  
-  **Axios** (For API requests)  
-  **Styled CSS, Bootstrap, Tailwind**  

### **Backend** (Port: `3000`)  
-  **Next.js** (API routes for backend logic)  
-  **MySQL** (Database for habit tracking)  
-  **JWT Authentication** (Secure login system) 

## 📂 Project Structure
### Habit Tracker
```
habit-tracker
│
├── habit-front (Frontend)
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/            # Main pages (Dashboard, Login, Signup, etc.)
│   │   ├── context/          # State management (if applicable)
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│
├── habit-back (Backend)
│   ├── app/api/               # API routes
│   │   ├── charts/            # Bar graph, donut chart, heatmap, pie chart
│   │   ├── habitlog/          # Logging habit completions
│   │   ├── habits/            # CRUD operations for habits
│   │   ├── rewards/           # Reward system API
│   │   ├── streaklog/         # Tracking streak history
│   │   ├── statuslog/         # Tracking status history
│   │   ├── stats/             # Statistics for Reward page
│   │   ├── newstat/           # Updating status from calendar
│   │
│   ├── app/cron/              # Scheduled tasks (e.g., reset habits)
│   ├── auth.ts                # Authentication handling
```


## 🚀 Getting Started

### 📌 Prerequisites
Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [MySQL](https://www.mysql.com/)
- npm (package manager)

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/sobhushan/habit-tracker.git
cd habit-tracker
```

### 2️⃣ Install Dependencies

#### Frontend
```sh
cd habit-front
npm install
```

#### Backend
```sh
cd ../habit-back
npm install
```

### 3️⃣ Set Up Database
- Start your MySQL server.
- Create a new database (e.g., `habit_tracker`).
- Import the database schema if available.

### 4️⃣ Run the Application

#### Start Backend (Port: 3000)
```sh
cd habit-back
npm run dev
```

#### Start Frontend (Port: 5134)
```sh
cd habit-front
npm run dev
```

### 5️⃣ Open in Browser
Once both frontend and backend are running, open your browser and go to:

```
http://localhost:5134
```
🎉 **You're all set!** Start tracking your habits now!
