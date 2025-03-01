import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {MoonLoader} from 'react-spinners'
import Graph from "../components/Graph";
import Nav from "../components/Nav";
import Spinner from "../components/Spinner";
import {Routes,Route} from 'react-router-dom'

function Profile() {
    const { handle } = useParams();
    const [userdata, setuserdata] = useState(null); 
    const [error, setError] = useState(false);
    const fetchData = async () => {
        
        try {
            const url = `https://codeforces.com/api/user.info?handles=${handle}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === "OK" && data.result.length > 0) {
                const { rating, maxRating, titlePhoto, rank, contribution } = data.result[0];
                setuserdata({ rating, maxrating: maxRating, titlePhoto, rank, contribution });
                setError(false);
            } else {
                setError(true); 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true); 
        }
    };

    useEffect(() => {
        fetchData();
    }, [handle]);

    return (
        <div>
            {error ? (
                <p>User doesn't exist</p>
            ) : userdata ? (
                <div className="h-screen w-screen flex flex-col items-center ">
                    <Nav handle={handle}/>
                    <div className="flex justify-center items-center gap-x-6 w-full mt-4">
                    <img src={userdata.titlePhoto} alt="Profile" className="w-50"/>
                    <div className="text-2xl">
                        <p className="flex gap-x-3"><span className="font-semibold">Handle:</span> {handle}</p>
                        <p className="flex gap-x-3"><span className="font-semibold">Rating:</span> {userdata.rating}</p>
                        <p className="flex gap-x-3"><span className="font-semibold">Max Rating:</span> {userdata.maxrating}</p>
                        <p className="flex gap-x-3"><span className="font-semibold">Rank:</span> {userdata.rank}</p>
                        <p className="flex gap-x-3"><span className="font-semibold">Contribution:</span> {userdata.contribution}</p>
                    </div>
                    </div>
                    <Graph handle={handle}/>
                 
                </div>
            ) : (
               <Spinner/>
            )}
        </div>
    );
}

export default Profile;
