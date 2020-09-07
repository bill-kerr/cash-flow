import React from 'react';
import { CashOutline, TrendingUpOutline, CalendarOutline, SwitchHorizontalOutline } from '@graywolfai/react-heroicons';

type IconTypes = 'cash' | 'investments' | 'transaction_schedules' | 'upcoming_transactions';

const iconClasses = 'h-6 w-6 text-gray-300';
const icons = {
  cash: <CashOutline className={iconClasses} />,
  investments: <TrendingUpOutline className={iconClasses} />,
  transaction_schedules: <CalendarOutline className={iconClasses} />,
  upcoming_transactions: <SwitchHorizontalOutline className={iconClasses} />,
};

interface SectionTitleBarProps {
  iconType: IconTypes;
  titleText: string;
}

export const SectionTitleBar: React.FC<SectionTitleBarProps & React.HTMLProps<HTMLDivElement>> = ({
  iconType,
  titleText,
  ...props
}) => {
  return (
    <div {...props} className={`${props.className} bg-gray-700 p-4 rounded-t shadow flex align-center`}>
      {icons[iconType]}
      <span className="ml-2">{titleText}</span>
    </div>
  );
};
