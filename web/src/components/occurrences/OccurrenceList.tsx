import React, { useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../../store';
import { getOccurrences } from '../../store/occurrences/actions';
import { OccurrenceItem } from './OccurrenceItem';

export const OccurrenceList: React.FC = () => {
  const occurrences = useTypedSelector(({ occurrences }) => occurrences.occurrences);
  const balance = useTypedSelector(({ settings }) => settings.currentCash);
  const dispatch = useTypedDispatch();
  useEffect(() => {
    dispatch(getOccurrences('2020-05-01', '2020-06-01'));
  }, [dispatch]);

  let currentBalance = balance;
  const renderList = () =>
    occurrences.map((occurrence) => {
      currentBalance += occurrence.amount;
      return <OccurrenceItem occurrence={occurrence} balance={currentBalance} spacing="tight" />;
    });

  return (
    <div>
      <div className="flex bg-gray-700">
        <ListHeading classes="w-1/6 pl-4" heading="Date" />
        <ListHeading classes="flex-grow pl-2" heading="Description" />
        <ListHeading classes="w-1/12 pl-2 tracking-wider" align="right" heading="Amount" />
        <ListHeading classes="w-1/12 pl-2 tracking-wider" align="right" heading="Balance" />
        <ListHeading classes="w-1/5 pl-2 pr-4" align="right" heading="Actions" />
      </div>
      <div className="bg-gray-800">{occurrences.length > 0 && renderList()}</div>
    </div>
  );
};

interface ListHeadingProps {
  heading: string;
  align?: 'right' | 'left' | 'center';
  classes?: string;
}

const ListHeading: React.FC<ListHeadingProps> = ({ align = 'left', classes = '', heading }) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={`py-3 whitespace-no-wrap flex-shrink-0 small-header ${alignments[align]} ${classes}`}>
      {heading}
    </div>
  );
};
