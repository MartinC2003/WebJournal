'use client';
import ViewEntry from './view-entry';
import { UserAuth } from '../../api/AuthContext';
import BasicDateCalendar from './calendar';
import React, { useState, useEffect } from "react";

const gridContainerStyle = {
  display: 'grid',
  backgroundColor: '#ebdfbc',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gridTemplateRows: 'repeat(3, 1fr)',
  padding: '50px',
  columnGap: '10px',
  rowGap: '10px'
};

const ViewEntryContainerStyle = {
  backgroundColor: 'white',
  gridArea: '1 / 4 / 4 / 6',
};

const ViewCalendarStyle = {
  gridArea: '1 / 1 / 4 / 4',
}

const ViewEntryPage = () => {
  const { user } = UserAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));

  if (!user) {
    return (
      <div style={gridContainerStyle}>
        <p>Please log in to view an entry.</p>
      </div>
    );
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <div style={gridContainerStyle}>
      <div style={ViewEntryContainerStyle}>
        <ViewEntry selectedDate={selectedDate} />
      </div>
      <div style={ViewCalendarStyle}>
        <BasicDateCalendar onDateSelect={handleDateSelect} />
      </div>
    </div>
  );
}

export default ViewEntryPage;
