import React, { useState } from "react";
import { Todate } from "../toDate";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DisplayRangeDisplay = ({
  fromDate,
  toDate,
  schedules,
  setSchedules,
}) => {
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currendDate = new Date(startDate);
    while (currendDate <= endDate) {
      dates.push(new Date(currendDate));
      currendDate.setDate(currendDate.getDate() + 1);
    }
    return dates;
  };
  if (!fromDate || !toDate) {
    return (
      <>
        {" "}
        <strong>Schedules</strong>
      </>
    );
  }

  const dateRange = getDatesInRange(fromDate, toDate);
  const handleDateClick = (date) => {
    const existingSchedule = schedules.find(
      (s) => s.date.toDateString() === date.toDateString()
    );
    if (existingSchedule) {
      setSchedules(
        schedules.filter(
          (s) => s.date.toDateString() !== date.toDateString()
        )
      );
    } else {
      setSchedules([
        ...schedules,
        { date, startTime: null, endTime: null },
      ]);
    }
  };
  const updateSchedule = (index, field, value) => {
    const newSchedules = [...schedules];
    newSchedules[index][field] = value;
    setSchedules(newSchedules);
  };
  return (
    <div>
      <h2>Dates in range</h2>
      {dateRange.map((date) => (
        <button
          key={date.toISOString()}
          onClick={() => handleDateClick(date)}
          style={{
            backgroundColor: schedules.some(
              (s) => s.date.toDateString() === date.toDateString()
            )
              ? "lightblue"
              : "white",
          }}
        >
          {date.toDateString()}
        </button>
      ))}
      {schedules.map((schedule, index) => (
        <div key={schedule.date.toISOString()}>
          <h3>Selected Date: {schedule.date.toDateString()}</h3>
          <DatePicker
            selected={schedule.startTime}
            onChange={(time) =>
              updateSchedule(index, "startTime", time)
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Start Time"
            dateFormat="h:mm aa"
          />
          <DatePicker
            selected={schedule.endTime}
            onChange={(time) =>
              updateSchedule(index, "endTime", time)
            }
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="End Time"
            dateFormat="h:mm aa"
            minTime={schedule.startTime}
            maxTime={
              schedule.startTime &&
              new Date(
                schedule.startTime.getTime() + 12 * 60 * 60 * 1000
              )
            }
          />
        </div>
      ))}
    </div>
  );
};
export default DisplayRangeDisplay;
