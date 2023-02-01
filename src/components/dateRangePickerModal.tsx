import React from 'react';
import Modal from 'react-modal';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import {DateRangePicker} from "react-date-range";

export const DatePickerModal = ({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (start: Date, end: Date) => void;
}) => {

  const handleSelect = (ranges: any) => {
    console.log(ranges);
    const start: Date = ranges.selection.startDate;
    const end: Date = ranges.selection.endDate;

    console.warn(`ranges start: ${start} end: ${end}`);
    onSelect(start, end)
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  }

  return (
    <Modal
      onRequestClose={onClose}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
      isOpen={open}
    >
      <h2 className="mb-4">Select Date Range</h2>
      <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
      />
    </Modal>
  );
};
