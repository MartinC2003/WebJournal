import { db } from '@/api/firebase';
import { Badge, Calendar } from 'antd';
import dayjs from 'dayjs';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function getTimeRange(month, year) {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const monthIndex = monthNames.indexOf(month);
  if (monthIndex === -1) {
    throw new Error("Invalid month provided");
  }

  const startDate = new Date(year, monthIndex, 1);
  const endDate = new Date(year, monthIndex + 1, 0);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}

const fetchEntriesForMonth = async (month, year, setMarkedDates) => {
  const { startDate, endDate } = getTimeRange(month, year);

  try {
    const dairyEntriesRef = collection(db, "DairyEntries");
    const q = query(
      dairyEntriesRef,
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);
    const datesWithEntries = [];

    querySnapshot.forEach((doc) => {
      const date = doc.data().date; 
      datesWithEntries.push(date);
    });

    setMarkedDates(datesWithEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
};

const fetchEntriesForYear = async (year, setMarkedMonths) => {
  const startDate = new Date(year, 0, 1); 
  const endDate = new Date(year, 11, 31); 

  try {
    const dairyEntriesRef = collection(db, "DairyEntries");
    const q = query(
      dairyEntriesRef,
      where("date", ">=", startDate.toISOString().slice(0, 10)),
      where("date", "<=", endDate.toISOString().slice(0, 10))
    );

    const querySnapshot = await getDocs(q);
    const monthsWithEntries = [];

    querySnapshot.forEach((doc) => {
      const date = doc.data().date;
      const month = dayjs(date).month();
      monthsWithEntries.push(month);
    });

    setMarkedMonths(monthsWithEntries);
  } catch (error) {
    console.error("Error fetching entries:", error);
  }
};

const BasicDateCalendar = ({ onDateSelect, selectedDate, markedDates,   }) => {
  const [markedDatesLocal, setMarkedDates] = useState(markedDates || []); 
  const [markedMonths, setMarkedMonths] = useState([]); 

  useEffect(() => {
    if (!selectedDate) return;
    const selectedDayjs = dayjs(selectedDate);
    const month = selectedDayjs.format('MMMM');
    const year = selectedDayjs.year();

    fetchEntriesForMonth(month, year, setMarkedDates);
    fetchEntriesForYear(year, setMarkedMonths);
  }, [selectedDate]);

  const onPanelChangeHandler = (value, ) => {
    
    const selectedDayjs = dayjs(value);
    const formattedDate = selectedDayjs.format('YYYY-MM-DD');
    
    onDateSelect(formattedDate);   
  };

  const dateCellRender = (current) => {
    const date = current.format('YYYY-MM-DD');
    if (markedDatesLocal.includes(date)) {
      return (
        <ul className="events">
          <li>
            <Badge status="success" text="Entry" />
          </li>
        </ul>
      );
    }
    return null;
  };

  const monthCellRender = (current) => {
    const month = current.month();
    if (markedMonths.includes(month)) {
      return (
        <div className="notes-month">
          <section>📅</section>
          <span>Has Entries</span>
        </div>
      );
    }
    return null;
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      <Calendar
        value={dayjs(selectedDate)}
        onSelect={onPanelChangeHandler}
        cellRender={cellRender}
      />
    </div>
  );
};

export default BasicDateCalendar;