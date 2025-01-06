import React, { useState } from "react";
import DatePicker from "react-datepicker";

export const Todate = ({ selectedDate, setSelectedDate }) => {
  return (
    <div style={{ display: "inline" }}>
      <p>
        <strong>To Date</strong>{" "}
      </p>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        dateFormat="yyyy/MM/dd"
        minDate={new Date()}
        placeholderText="dd-mm-yyyy"
      />
    </div>
  );
};
