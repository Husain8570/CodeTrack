import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Spinner from "../components/Spinner";
import { MoonLoader } from "react-spinners";

function Problem() {
    const [ratingData, setRatingData] = useState([]);
    const [error, setError] = useState(false);
    const { handle }=useParams()
    const fetchData = async () => {
        try {
            const url = `https://codeforces.com/api/user.status?handle=${handle}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === "OK") {
                
                const ratingCount = {};

                data.result.forEach((submission) => {
                    if (submission.verdict === "OK" && submission.problem.rating) {
                        const rating = submission.problem.rating;
                        ratingCount[rating] = (ratingCount[rating] || 0) + 1;
                    }
                });

                
                const formattedData = Object.keys(ratingCount).map((rating) => ({
                    rating: rating,
                    count: ratingCount[rating],
                }));

                setRatingData(formattedData);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching problem rating data:", err);
            setError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [handle]);

    return (
        <div className="flex w-screen h-screen justify-center items-center">
          <div style={{ width: "600px", height: "400px" }}>
            {error ? (
                <p>User doesn't exist or has no solved problems.</p>
            ) : ratingData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="rating" label={{ value: "Rating", position: "insideBottom", offset: -5 }} />
                        <YAxis label={{ value: "Problem Count", angle: -90, position: "insideLeft" }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
              <MoonLoader/>
            )}
        </div>
        </div>
    );
}

export default Problem;
