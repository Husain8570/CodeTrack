import React, { useState } from 'react';
import Form from '../components/Form';
import Problems from '../components/Problems';

function ProblemTracker() {
  const [refresh, setRefresh] = useState(false);

  const handleProblemAdded = () => {
    setRefresh(!refresh)
  };
  

  return (
    <div className="overflow-y-auto w-screen min-h-screen bg-gray-900 flex flex-col md:flex-row justify-center items-start gap-8 p-8">
      <Form onProblemAdded={handleProblemAdded} />
      <Problems refresh={refresh} setRefresh={setRefresh}/>
    </div>
  );
}

export default ProblemTracker;
