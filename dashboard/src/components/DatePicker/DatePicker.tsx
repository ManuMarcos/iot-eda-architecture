import { use, useEffect, useState } from "react";

import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export function MyDatePicker({handleDateToFilter}: {handleDateToFilter: (date: Date | null) => void}) {
  const [selected, setSelected] = useState<Date | undefined>();

  useEffect(() => {
    handleDateToFilter(selected || null);
  }, [selected, handleDateToFilter]);

  return (
    <DayPicker
      animate
      mode="single"
      selected={selected}
      onSelect={setSelected}
      footer={
        selected ? `Selected: ${selected.toLocaleDateString()}` : "Pick a day."
      }
    />
  );
}