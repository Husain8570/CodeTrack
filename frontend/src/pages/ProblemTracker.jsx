import React, { useState } from 'react';
import Form from '../components/Form';
import Problems from '../components/Problems';

function ProblemTracker() {

  return (
    <div className="overflow-y-auto w-screen min-h-screen bg-gray-900 flex flex-col md:flex-row justify-center items-start gap-8 p-8">
      <Form/>
      <Problems/>
    </div>
  );
}

export default ProblemTracker;
