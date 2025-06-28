import React, { useEffect, useState } from 'react';
import ProblemCard from './ProblemCard';
import SearchBar from './SearchBar';
import { useProblemContext } from '../ProblemContext'
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

function Problems() {
  const { problems, setProblems } = useProblemContext();
  const [allProblems, setAllProblems] = useState([]); // Store all problems for local search

  function searchHandler(title) {
    if (title.trim() === '') {
      setProblems(allProblems);
    } else {
      const filtered = allProblems.filter((p) =>
        p.title.toLowerCase().includes(title.toLowerCase())
      );
      setProblems(filtered);
    }
  }

  useEffect(() => {
    async function fetchProblems() {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found.");
        return;
      }

      try {
        const res = await fetch(`${SERVER_URL}/api/problems`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setProblems(data.problems || []);
        setAllProblems(data.problems || []);
      } catch (err) {
        console.error('Error fetching problems:', err);
      }
    }

    fetchProblems();
  }, []);

  return (
    <div className="text-white flex flex-col gap-4 p-4 w-full md:w-1/2 items-center max-h-[80vh] overflow-y-auto bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Problems</h2>
      <SearchBar onSearch={searchHandler} />
      {problems.length > 0 ? (
        problems.map((problem) => (
          <ProblemCard 
            key={problem._id} 
            title={problem.title} 
            url={problem.url} 
            time={problem.time} 
            topic={problem.topic} 
            id={problem._id}
            expectedTime={problem.estimatedTime}
            difficulty={problem.predictedDifficulty}
          />
        ))
      ) : (
        <p className="text-gray-400">No problems available</p>
      )}
    </div>
  );
}

export default Problems;
