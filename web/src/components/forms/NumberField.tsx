import React from 'react';
import { useField } from 'formik';

interface NumberFieldProps {
  name: string;
  label: string;
  labelPosition?: 'left' | 'top';
  icon?: string | JSX.Element;
  iconPosition?: 'left' | 'right';
}

export const NumberField: React.FC<NumberFieldProps> = ({
  labelPosition = 'left',
  iconPosition = 'left',
  ...props
}) => {
  const [field] = useField(props);
  const containerDisplay = labelPosition === 'left' ? 'flex-row' : 'flex-col';
  return (
    <div className={`flex ${containerDisplay} items-center`}>
      <label htmlFor={props.label} className="whitespace-no-wrap">
        {props.label}
      </label>
      <div className="ml-2 flex items-center w-full bg-gray-700 rounded">
        <span className="ml-2">{props.icon}</span>
        <input
          {...field}
          {...props}
          className="p-2 h-full w-full bg-transparent rounded focus:outline-none focus:shadow-outline"
        />
      </div>
    </div>
  );
};
