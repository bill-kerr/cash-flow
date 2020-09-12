import React from 'react';
import { Occurrence } from '../../store/occurrences/types';

interface OccurrenceItemProps {
  occurrence: Occurrence;
  balance: number;
  spacing?: 'tight' | 'normal' | 'loose';
}

export const OccurrenceItem: React.FC<OccurrenceItemProps> = ({ spacing = 'normal', occurrence, balance }) => {
  const spaceStyle = {
    tight: 'py-2',
    normal: 'py-3',
    loose: 'py-4',
  }[spacing];

  return (
    <div className={`${spaceStyle} flex text-sm`}>
      <ItemCell className="w-1/6 pl-4">{occurrence.date}</ItemCell>
      <ItemCell className="flex-grow">{occurrence.description}</ItemCell>
      <ItemCell className="w-1/12" align="right">
        {occurrence.amount}
      </ItemCell>
      <ItemCell className="w-1/12" align="right">
        {balance}
      </ItemCell>
      <ItemCell className="w-1/5" align="center">
        test
      </ItemCell>
    </div>
  );
};

interface ItemCellProps {
  align?: 'left' | 'center' | 'right';
}

const ItemCell: React.FC<React.HTMLProps<HTMLDivElement> & ItemCellProps> = ({
  children,
  className,
  align = 'left',
  ...props
}) => {
  const alignment = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <div className={`pl-2 whitespace-no-wrap ${className} ${alignment}`} {...props}>
      {children}
    </div>
  );
};
