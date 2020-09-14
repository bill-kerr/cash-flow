import React from 'react';
import { useDatePicker } from '../../hooks/useDatePicker';
import { SectionTitleBar } from '../SectionTitleBar';
import { OccurrenceList } from './OccurrenceList';

export const OccurrenceSection: React.FC = () => {
  const { field, dates } = useDatePicker({
    name: 'startDate',
    rangeOverflow: 'blanks',
  });

  return (
    <div className="flex-1">
      <SectionTitleBar iconType="upcoming_transactions" titleText="Your upcoming transactions">
        <input {...field} className="bg-gray-800 p-2 rounded" />
      </SectionTitleBar>
      {dates.map((props) => (
        <span {...props} className="px-1">
          {props.label}
        </span>
      ))}
      <OccurrenceList />
    </div>
  );
};
