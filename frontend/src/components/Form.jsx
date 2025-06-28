import React, { useState } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { PulseLoader } from 'react-spinners';
import { useProblemContext } from '../ProblemContext';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const topicOptions = [
  "Arrays", "Linked List", "Stacks", "Queues", "Trees", "Graphs",
  "Dynamic Programming", "Sorting", "Searching", "Bit Manipulation",
  "Math", "Backtracking", "Trie", "Segment Tree"
];

const tagOptions = [
  { value: 'binary search', label: 'Binary Search' },
  { value: 'greedy', label: 'Greedy' },
  { value: 'dfs traversal', label: 'DFS Traversal' },
  { value: 'bfs traversal', label: 'BFS Traversal' },
  { value: 'recursion', label: 'Recursion' },
  { value: 'sliding window', label: 'Sliding Window' },
  { value: 'two pointer', label: 'Two Pointer' },
  { value: 'heap', label: 'Heap / Priority Queue' },
  { value: 'prefix sum', label: 'Prefix Sum' },
  { value: 'union find', label: 'Union Find / DSU' },
  { value: 'topological sort', label: 'Topological Sort' }
];

const customSelectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#374151',
    borderColor: '#4B5563',
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1F2937',
    color: 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#3B82F6',
    color: 'white',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#2563EB' : '#1F2937',
    color: 'white',
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
};

const Form = () => {
  const { setProblems } = useProblemContext();

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    time: '',
    topic: '',
    notes: '',
    tags: [],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTagsChange = (selectedOptions) => {
    const tagValues = selectedOptions.map(option => option.value);
    setFormData({ ...formData, tags: tagValues });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `${SERVER_URL}/api/problems/add`;
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Problem added successfully");

        // Update context with new problem
        setProblems((prev) => [...prev, data.problem]);

        setFormData({ title: '', url: '', time: '', topic: '', notes: '', tags: [] });
      } else {
        toast.error(data.message || "Failed to add problem");
      }
    } catch (error) {
      toast.error("Error adding problem");
    } finally {
      setLoading(false);
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
          {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((t) => (
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
          {topicOptions.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <div>
          <label className="block mb-1 font-semibold">Tags (optional)</label>
          <Select
            isMulti
            options={tagOptions}
            value={tagOptions.filter(opt => formData.tags.includes(opt.value))}
            onChange={handleTagsChange}
            styles={customSelectStyles}
            className="text-black"
          />
        </div>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 bg-gray-700 text-white"
          placeholder="Notes"
        />
        <button 
          type="submit" 
          className="w-full bg-blue-500 p-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? <PulseLoader color="#fff" size={10} /> : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default Form;
