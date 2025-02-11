import { Calendar } from 'antd';
const BasicDateCalendar = ({ onDateSelect }) => {
  const onPanelChange = (value) => {
    const selectedDate = value.format('YYYY-MM-DD');
    console.log('Selected Date:', selectedDate);  
    onDateSelect(selectedDate);  
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <Calendar onSelect={onPanelChange} className="custom-calendar" />
    </div>  
  );
};

export default BasicDateCalendar;