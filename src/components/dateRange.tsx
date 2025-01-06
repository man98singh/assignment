import React, { useState } from "react";
import { FromDate } from "./fromDate";
import { Todate } from "./toDate";
import DisplayRangeDisplay from "./showCampaign/displayDateRange";
import axios from "axios";
import { CampaignType } from "./Campaigntype";
interface Campaign {
  id: number;
  type: string;
  start_date: string;
  end_date: string;
  schedules?: Array<{
    date: string;
    start_time: string;
    end_time: string;
  }>;
}

interface DateRangeProps {
  isEdit?: boolean;
  campaignData?: Campaign;
  onCancel?: () => void;
}

export const DateRange = ({
  isEdit = false,
  campaignData,
  onCancel,
}: DateRangeProps) => {
  const [fromDate, setFromDate] = useState<Date | null>(
    isEdit && campaignData?.start_date
      ? new Date(campaignData.start_date)
      : null
  );
  const [toDate, setToDate] = useState<Date | null>(
    isEdit && campaignData?.end_date
      ? new Date(campaignData.end_date)
      : null
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(
    isEdit ? campaignData?.type : null
  );
  const [schedule, setSchedule] = useState<
    Array<{
      date: Date;
      startTime: Date;
      endTime: Date;
    }>
  >([]); // Initialize as empty array since schedules come from next_schedule

  const handleSubmit = async () => {
    if (
      !fromDate ||
      !toDate ||
      !selectedOption ||
      schedule.length === 0
    ) {
      console.error(
        "All fields must be filled and at least one schedule must be selected"
      );
      return;
    }

    try {
      const method = isEdit ? "put" : "post";
      const url = isEdit
        ? `http://localhost:3000/campaigns/${campaignData?.id}`
        : "http://localhost:3000/campaigns";

      await axios({
        method,
        url,
        data: {
          type: selectedOption,
          start_date: fromDate.toISOString().split("T")[0],
          end_date: toDate.toISOString().split("T")[0],
          schedules: schedule.map((s) => ({
            date: s.date.toISOString().split("T")[0],
            start_time: s.startTime.toTimeString().split(" ")[0],
            end_time: s.endTime.toTimeString().split(" ")[0],
          })),
        },
      });

      if (isEdit && onCancel) onCancel();
    } catch (error) {
      console.error("Error submitting campaign:", error);
    }
  };

  return (
    <div style={{ border: "2px solid grey" }}>
      <CampaignType
        selectedOption={selectedOption}
        setSelectedOption={setSelectedOption}
      />
      <div>
        <p>
          <strong>From Date</strong>
        </p>
        <div style={{ display: "flex" }}>
          <FromDate
            selecedtDate={fromDate}
            setSelecedtDate={setFromDate}
          />
          <Todate selectedDate={toDate} setSelectedDate={setToDate} />
        </div>
      </div>

      <DisplayRangeDisplay
        fromDate={fromDate}
        toDate={toDate}
        schedules={schedule}
        setSchedules={setSchedule}
      />
      <div>
        <button onClick={handleSubmit}>
          {isEdit ? "Update" : "Submit"}
        </button>
        {isEdit && <button onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
};
