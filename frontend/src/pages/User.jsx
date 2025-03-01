import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF4567", "#19FFAF"];
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Dashboard = () => {
  const [problems, setProblems] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) return; // No token, don't fetch data

    fetch(`${SERVER_URL}/api/auth/user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // Attach token in Authorization header
        "Content-Type": "application/json"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProblems(data.data.problems);
          setUsername(data.data.username);
        }
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Aggregate data for charts
  const topicStats = problems.reduce((acc, problem) => {
    if (!acc[problem.topic]) {
      acc[problem.topic] = { count: 0, time: 0 };
    }
    acc[problem.topic].count += 1;
    acc[problem.topic].time += problem.time;
    return acc;
  }, {});

  // Convert object to array for Recharts
  const pieData = Object.keys(topicStats).map((topic) => ({
    name: topic,
    value: topicStats[topic].count,
  }));

  const barData = Object.keys(topicStats).map((topic) => ({
    topic,
    problems: topicStats[topic].count,
    time: topicStats[topic].time,
  }));

  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-500">Keep Going, {username}! 🚀</h1>

      {/* Charts Container */}
      <div className="w-full flex flex-col md:flex-row items-center justify-around gap-8">
        
        {/* Pie Chart */}
        <div className="w-full md:w-1/2 h-[400px] flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Problem Distribution by Topic</h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="w-full md:w-1/2 h-[400px] flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-4">Problems Count & Time Spent</h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={barData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="topic" type="category" width={100} />
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              <Bar dataKey="problems" fill="#0088FE" name="Number of Problems" />
              <Bar dataKey="time" fill="#FFBB28" name="Time Spent (min)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
