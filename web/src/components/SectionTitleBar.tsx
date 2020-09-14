import React from 'react';
import { CashOutline, TrendingUpOutline, CalendarOutline, SwitchHorizontalOutline } from '@graywolfai/react-heroicons';

type IconTypes = 'cash' | 'investments' | 'transaction_schedules' | 'upcoming_transactions';

const iconClasses = 'h-6 w-6 text-gray-300';
const icons: { [key: string]: JSX.Element } = {
  cash: <CashOutline className={iconClasses} />,
  investments: <TrendingUpOutline className={iconClasses} />,
  transaction_schedules: <CalendarOutline className={iconClasses} />,
  upcoming_transactions: <SwitchHorizontalOutline className={iconClasses} />,
  none: <></>,
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
    <div
      {...props}
      className={`${props.className} flex items-center justify-between bg-gray-700 p-4 rounded-t shadow flex align-center`}
    >
      <div className="flex items-center">
        {icons[iconType]}
        <span className="ml-2 font-medium">{titleText}</span>
      </div>
      <div>{props.children}</div>
    </div>
  );
};
