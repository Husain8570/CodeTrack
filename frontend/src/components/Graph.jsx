import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Graph({ handle }) {
    const [ratingData, setRatingData] = useState([]);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        try {
           
            const url = `https://codeforces.com/api/user.rating?handle=${handle}`;
            const res = await fetch(url);
            const data = await res.json();


            if (data.status === "OK" && data.result.length > 0) {
                const formattedData = data.result.map(entry => ({
                    date: new Date(entry.ratingUpdateTimeSeconds * 1000).toLocaleDateString(),
                    rating: entry.newRating
                }));

              

                setRatingData(formattedData);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching rating data:", err);
            setError(true);
        }
    };

    useEffect(() => {
        if (handle) fetchData();
    }, [handle]);

    return (
        <div style={{ width: "600px", height: "400px" }}>
            {error ? (
                <p>User doesn't exist or has no rating history.</p>
            ) : ratingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ratingData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={["auto", "auto"]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rating" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Graph;
