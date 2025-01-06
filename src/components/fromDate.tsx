import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const FromDate = ({ selecedtDate, setSelecedtDate }) => {
  return (
    <div style={{ display: "inline" }}>
      <DatePicker
        selected={selecedtDate}
        onChange={(date) => setSelecedtDate(date)}
        dateFormat="yyyy/MM/dd"
        minDate={new Date()}
        placeholderText="dd-mm-yyyy"
      />
    </div>
  );
};
