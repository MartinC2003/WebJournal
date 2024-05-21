import React from 'react';
import { Calendar } from 'antd';

const BasicDateCalendar = ({ onDateSelect }) => {
  const onPanelChange = (value) => {
    const selectedDate = value.format('YYYY-MM-DD');
    console.log('Selected Date:', selectedDate); // Log the selected date
    onDateSelect(selectedDate); // Call onDateSelect prop with the selected date
  };

  return <Calendar onSelect={onPanelChange} />;
};

export default BasicDateCalendar;
