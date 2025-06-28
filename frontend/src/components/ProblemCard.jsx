import React, { useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { CgNotes } from "react-icons/cg";
import { useProblemContext } from '../ProblemContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ProblemCard = ({ title, url, time, topic, notes, id, expectedTime, difficulty }) => {
  const [showNotes, setShowNotes] = useState(false);
  const { problems, setProblems } = useProblemContext();

  async function deleteHandler() {
    const deleteUrl = `${SERVER_URL}/api/problems/delete/${id}`;
    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        // Remove the deleted problem from the global context
        setProblems(problems.filter(problem => problem._id !== id));
      } else {
        console.error("Failed to delete problem:", data.message);
      }
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  }

  return (
    <div className="bg-gray-700 text-white p-4 w-full rounded-lg shadow-md transition-transform transform hover:shadow-lg">
      <h3 className="text-2xl uppercase font-semibold text-center">{title}</h3>
      
      <div className="space-y-1 mt-2 text-xl">
        <div className="flex justify-between">
          <span className="font-medium">Topic:</span>
          <span>{topic}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium">Time Taken:</span>
          <span>{time} min</span>
        </div>
        {difficulty && (
          <div className="flex justify-between">
            <span className="font-medium">Estimated Difficulty:</span>
            <span className="capitalize">{difficulty}</span>
          </div>
        )}
        {expectedTime && (
          <div className="flex justify-between">
            <span className="font-medium">Expected solve time:</span>
            <span>{expectedTime} min</span>
          </div>
        )}
      </div>

      <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 block font-medium">
        Solve Problem →
      </a>

      {/* Buttons Section */}
      <div className="flex justify-between mt-4 flex-col sm:flex-row">
        {/* Notes Button */}
        <button 
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition flex items-center gap-1" 
          onClick={() => setShowNotes(!showNotes)}
        >
          <CgNotes className="text-lg" /> {showNotes ? "Hide Notes" : "Show Notes"}
        </button>

        {/* Delete Button */}
        <button 
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition flex items-center gap-1" 
          onClick={deleteHandler}
        >
          <MdDeleteOutline className="text-lg" /> Delete
        </button>
      </div>

      {/* Notes Section */}
      {showNotes && (
        <div className="mt-2 p-2 bg-gray-600 rounded-md text-white">
          <p className="text-sm">{notes || "No notes available"}</p>
        </div>
      )}
    </div>
  );
};

export default ProblemCard;
