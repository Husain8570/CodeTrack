import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Pass input value to parent component
  };

  return (
    <div className="w-full flex justify-center mb-4">
      <input
        type="text"
        placeholder="search using title..."
        value={query}
        onChange={handleChange}
        className="w-full max-w-md p-2 border rounded-lg bg-gray-700 text-white placeholder-gray-400"
      />
    </div>
  );
};

export default SearchBar;
