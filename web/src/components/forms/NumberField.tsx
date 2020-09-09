import React, { useState } from 'react';
import { useField } from 'formik';
import NumberFormat from 'react-number-format';

interface NumberFieldProps {
  name: string;
  label: string;
  labelPosition?: 'left' | 'top';
  icon?: string | JSX.Element;
  iconPosition?: 'left' | 'right';
  formatter?: (value: string) => string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  labelPosition = 'left',
  iconPosition = 'left',
  formatter = defaultFormatter,
  ...props
}) => {
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [field] = useField(props);
  const containerDisplay = labelPosition === 'left' ? 'flex-row' : 'flex-col';
  const inputMargin = labelPosition === 'left' ? 'ml-2' : 'mt-2';
  const iconMargin = iconPosition === 'left' ? 'ml-2' : 'mr-2';

  return (
    <div className={`flex ${containerDisplay} items-center justify-center`}>
      <label htmlFor={props.label} className="whitespace-no-wrap">
        {props.label}
      </label>
      <div
        className={`${inputMargin} relative flex items-center w-full bg-gray-700 rounded focus-within:shadow-outline transition-shadow duration-100 cursor-text`}
        onFocus={() => inputRef?.select()}
        onClick={() => inputRef?.select()}
      >
        <span className={`${iconMargin} pointer-events-none`}>{props.icon}</span>
        <NumberFormat
          {...field}
          {...props}
          className="p-2 h-full w-full bg-transparent rounded focus:outline-none"
          thousandSeparator=","
          decimalScale={2}
          fixedDecimalScale={true}
          allowNegative={false}
          defaultValue={0}
          onFocus={(e) => e.target.select()}
          getInputRef={(el: HTMLInputElement) => setInputRef(el)}
        />
      </div>
    </div>
  );
};

const defaultFormatter = (value: string) => {
  const formattedValue = value.replace(/\D/, '');
  return formattedValue;
};
