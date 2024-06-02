// src/Heatmap.js
import React, { useState, useEffect } from 'react';
import './Heatmap.css';

const generateDateArray = (year) => {
  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const month = [];
    const currentDate = new Date(year, monthIndex, 1);
    while (currentDate.getMonth() === monthIndex) {
      month.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return month;
  });
  return months;
};

const getMonthLabels = () => {
  return Array.from({ length: 12 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), index, 1);
    return date.toLocaleString('default', { month: 'short' });
  });
};

const getYearOptions = (startYear) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = startYear; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
};

const Heatmap = () => {
  const startYear = 2020; // Modify as needed
  const yearOptions = getYearOptions(startYear);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [contributions, setContributions] = useState(
    JSON.parse(localStorage.getItem('contributions')) || {}
  );
  const [dateInput, setDateInput] = useState('');
  const [countInput, setCountInput] = useState('');

  useEffect(() => {
    localStorage.setItem('contributions', JSON.stringify(contributions));
  }, [contributions]);

  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));
  };

  const handleAddContribution = () => {
    const yearContributions = contributions[selectedYear] || {};
    const newContributions = {
      ...contributions,
      [selectedYear]: { ...yearContributions, [dateInput]: countInput },
    };
    setContributions(newContributions);
    setDateInput('');
    setCountInput('');
  };

  const handleResetContributions = () => {
    setContributions({});
  };

  const months = generateDateArray(selectedYear);
  const monthLabels = getMonthLabels();
  const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="heatmap-container">
      <div className="header">
        <div className="months-row">
          {monthLabels.map((month, index) => (
            <div key={index} className="month-label">
              {month}
            </div>
          ))}
        </div>
      </div>
      <div className="heatmap-grid">
        <div className="day-vertical">
          {weekLabels.map((label, index) => (
            <div key={index} className="day-label">
              {label}
            </div>
          ))}
        </div>
        {months.map((month, monthIndex) => (
          <div key={monthIndex} className="month-block">
            {month.map((date, index) => {
              const formattedDate = date.toISOString().split('T')[0];
              const yearContributions = contributions[selectedYear] || {};
              const count = yearContributions[formattedDate] || 0;
              const intensity = Math.min(4, Math.floor(count / 5));
              return (
                <div
                  key={index}
                  className={`square intensity-${intensity}`}
                  title={`${formattedDate}: ${count} contributions`}
                ></div>
              );
            })}
          </div>
        ))}
        <div className='year-select-container'>
        <select value={selectedYear} onChange={handleYearChange} className="year-select">
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        </div>  
      </div>
      <div className="controls">
        <input
          type="date"
          value={dateInput}
          onChange={(e) => setDateInput(e.target.value)}
          min={`${selectedYear}-01-01`}
          max={`${selectedYear}-12-31`}
        />
        <input
          type="number"
          value={countInput}
          onChange={(e) => setCountInput(e.target.value)}
        />
        <button onClick={handleAddContribution}>Add Contribution</button>
        <button onClick={handleResetContributions}>Reset</button>
      </div>
    </div>
  );
};

export default Heatmap;
