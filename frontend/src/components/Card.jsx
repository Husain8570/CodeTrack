import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Card() {
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");

  return (
    <div className="card bg-base-100 max-w-lg w-full shadow-xl bg-white rounded-2xl mx-auto mt-10 text-black p-5 sm:p-8">
      <figure className="px-5 pt-5">
        <img
          src="https://miro.medium.com/v2/resize:fit:1200/1*iPZ00kImJY8oVioV5Dy75A.jpeg"
          alt="Profile"
          className="rounded-xl w-full max-w-sm mx-auto"
        />
      </figure>

      <div className="card-body items-center text-center">
        <input
          type="text"
          placeholder="Enter Codeforces handle"
          className="border mb-5 px-4 py-2 text-lg w-full rounded-md"
          onChange={(e) => setHandle(e.target.value)}
        />

        <button
          className="py-2 px-6 bg-black text-white text-lg sm:text-xl rounded-md w-full sm:w-auto"
          onClick={() => { if (handle) navigate(`/profile/${handle}`) }}
        >
          Get Profile
        </button>
      </div>
    </div>
  );
}

export default Card;
