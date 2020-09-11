import React from 'react';

export const OccurrenceList: React.FC = () => {
  return (
    <div>
      <div className="flex bg-gray-700">
        <ListHeading classes="w-1/6 pl-4" heading="Date" />
        <ListHeading classes="flex-grow pl-2" heading="Description" />
        <ListHeading classes="w-1/12 pl-2" align="right" heading="Amount" />
        <ListHeading classes="w-1/12 pl-2" align="right" heading="Balance" />
        <ListHeading classes="w-1/5 pl-2 pr-4" align="right" heading="Actions" />
      </div>
      <div className="bg-gray-800">this is where the list goes</div>
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
