import React, { useEffect, useState } from 'react';
import ProblemCard from './ProblemCard';
import SearchBar from './SearchBar';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Problems({ refresh, setRefresh }) {
  const [problems, setProblems] = useState([]);
  const [allProblems, setAllProblems] = useState([]); // Store all problems

  function searchHandler(title) {
    if (title.trim() === '') {
      setProblems(allProblems); // Reset to original list
    } else {
      const filteredProblems = allProblems.filter((problem) =>
        problem.title.toLowerCase().includes(title.toLowerCase()) // Case-insensitive search
      );
      setProblems(filteredProblems);
    }
  }

  useEffect(() => {
    async function fetchProblems() {
      const token = localStorage.getItem("authToken"); // Get token from localStorage
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const response = await fetch(`${SERVER_URL}/api/problems`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token in Authorization header
          },
        });

        const data = await response.json();
        setProblems(data.problems || []);
        setAllProblems(data.problems || []); // Store original problems
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    }

    fetchProblems();
  }, [refresh]); // Re-fetch when refresh state changes

  return (
    <div className="text-white flex flex-col gap-4 p-4 w-full md:w-1/2 items-center max-h-[80vh] overflow-y-auto bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Problems</h2>
      <SearchBar onSearch={searchHandler} />
      {problems.length > 0 ? (
        problems.map((problem, index) => (
          <ProblemCard 
            key={problem._id} 
            title={problem.title} 
            url={problem.url} 
            time={problem.time} 
            topic={problem.topic} 
            id={problem._id}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        ))
      ) : (
        <p className="text-gray-400">No problems available</p>
      )}
    </div>
  );
}

export default Problems;
