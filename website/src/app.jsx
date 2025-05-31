import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import CyclingPage from '@pages/CyclingPage';
import SwimmingPage from '@pages/SwimmingPage';
import ActivitiesPage from '@pages/ActivitiesPage';
import HomePage from '@pages/HomePage';

function App() {
  return (
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cycling" element={<CyclingPage />} />
          <Route path="/swimming" element={<SwimmingPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
        </Routes>
      </div>
  );
}

export default App;
