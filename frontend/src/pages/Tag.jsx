import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function Tag() {
    const [tagData, setTagData] = useState([]);
    const [error, setError] = useState(false);
    const {handle}=useParams()
    const fetchData = async () => {
        try {
            const url = `https://codeforces.com/api/user.status?handle=${handle}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === "OK") {
                // Count problems based on tags
                const tagCount = {};

                data.result.forEach((submission) => {
                    if (submission.verdict === "OK" && submission.problem.tags) {
                        submission.problem.tags.forEach((tag) => {
                            tagCount[tag] = (tagCount[tag] || 0) + 1;
                        });
                    }
                });

                // Convert data to array format for Recharts
                const formattedData = Object.keys(tagCount).map((tag) => ({
                    tag: tag,
                    count: tagCount[tag],
                }));

                setTagData(formattedData);
                setError(false);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching problem tag data:", err);
            setError(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, [handle]);

    return (
        <div style={{ width: "100%", height: "500px" }}>
            {error ? (
                <p>User doesn't exist or has no solved problems.</p>
            ) : tagData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tagData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" label={{ value: "Problem Count", position: "insideBottom", offset: -5 }} />
                        <YAxis type="category" dataKey="tag" width={150} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8884d8" barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Tag;
