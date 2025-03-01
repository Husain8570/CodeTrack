import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Form = ({ onProblemAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    time: '',
    topic: '',
    notes: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${SERVER_URL}/api/problems/add`;
    const token = localStorage.getItem("authToken"); // Get token from localStorage

    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Attach token in Authorization header
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Problem added successfully");
        setFormData({ title: '', url: '', time: '', topic: '', notes: '' });
        onProblemAdded(); // Trigger re-fetch in Problems component
      } else {
        toast.error(data.message || "Failed to add problem");
      }
    } catch (error) {
      toast.error("Error adding problem");
    }
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-full md:w-1/2">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-700 text-white"
          required
        />
        <input
          type="url"
          name="url"
          placeholder="URL"
          value={formData.url}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-700 text-white"
          required
        />
        <select
          name="time"
          value={formData.time}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-700 text-white"
          required
        >
          <option value="">Select Time (min)</option>
          {[5, 10, 15, 30, 60].map((t) => (
            <option key={t} value={t}>{t} min</option>
          ))}
        </select>
        <select
          name="topic"
          value={formData.topic}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg bg-gray-700 text-white"
          required
        >
          <option value="">Select DSA Topic</option>
          {["Arrays", "Linked List", "Stacks", "Queues", "Trees", "Graphs", "Dynamic Programming", "Sorting", "Searching"].map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-700 text-white"
          placeholder="Notes"
        />
        <button type="submit" className="w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
