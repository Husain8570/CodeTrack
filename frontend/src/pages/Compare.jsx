import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

function Compare() {
    const [user1, setUser1] = useState("");
    const [user2, setUser2] = useState("");
    const [problemData, setProblemData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!user1 || !user2) {
            setError(true);
            return;
        }

        setLoading(true);
        try {
            // Fetch data separately for both users
            const res1 = await fetch(`https://codeforces.com/api/user.status?handle=${user1}`);
            const res2 = await fetch(`https://codeforces.com/api/user.status?handle=${user2}`);

            const data1 = await res1.json();
            const data2 = await res2.json();

            if (data1.status === "OK" && data2.status === "OK") {
                const submissions1 = data1.result;
                const submissions2 = data2.result;

                // Function to count problems by rating
                const countProblemsByRating = (submissions) => {
                    const ratingCount = {};
                    submissions.forEach((entry) => {
                        if (entry.verdict === "OK" && entry.problem.rating) {
                            const rating = entry.problem.rating;
                            ratingCount[rating] = (ratingCount[rating] || 0) + 1;
                        }
                    });
                    return ratingCount;
                };

                const ratings1 = countProblemsByRating(submissions1);
                const ratings2 = countProblemsByRating(submissions2);

                // Combine unique ratings from both users
                const uniqueRatings = Array.from(
                    new Set([...Object.keys(ratings1), ...Object.keys(ratings2)])
                ).map(Number).sort((a, b) => a - b);

                // Format data for the chart
                const formattedData = uniqueRatings.map((rating) => ({
                    rating,
                    [user1]: ratings1[rating] || 0,
                    [user2]: ratings2[rating] || 0,
                }));

                setProblemData(formattedData);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 className="text-2xl font-semibold ">Compare Codeforces Problem Solving</h2>
            <input
                type="text"
                placeholder="Enter first handle"
                value={user1}
                onChange={(e) => setUser1(e.target.value)}
                style={{ margin: "5px", padding: "8px" }}
                className="border py-6 "
            />
            <input
                type="text"
                placeholder="Enter second handle"
                value={user2}
                onChange={(e) => setUser2(e.target.value)}
                style={{ margin: "5px", padding: "8px" }}
                className="border py-6 "
            />
            <button onClick={fetchData} style={{ padding: "8px 15px", margin: "5px", cursor: "pointer" }} className="bg-black text-white">
                Compare
            </button>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>Invalid users or no problem data available.</p>}

            {problemData.length > 0 && !error && (
                <div style={{ width: "100%", height: "500px", marginTop: "20px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={problemData} margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="rating" label={{ value: "Problem Rating", position: "insideBottom", offset: -5 }} />
                            <YAxis label={{ value: "Count", angle: -90, position: "insideLeft" }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={user1} fill="#8884d8" name={user1} />
                            <Bar dataKey={user2} fill="#82ca9d" name={user2} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}

export default Compare;
