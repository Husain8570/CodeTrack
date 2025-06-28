import React, { createContext, useContext, useState } from 'react';

const ProblemContext = createContext();

export const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);

  return (
    <ProblemContext.Provider value={{ problems, setProblems }}>
      {children}
    </ProblemContext.Provider>
  );
};

export const useProblemContext = () => useContext(ProblemContext);
