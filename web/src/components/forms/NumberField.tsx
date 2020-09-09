import React, { useState } from 'react';
import { useField, FieldProps } from 'formik';
import NumberFormat from 'react-number-format';

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
  const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
  const [field] = useField({ ...props, component: PriceComponent });
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
          allowEmptyFormatting={true}
          allowLeadingZeros={false}
          defaultValue={0}
          isNumericString={true}
          onFocus={(e) => e.target.select()}
          getInputRef={(el: HTMLInputElement) => setInputRef(el)}
          onValueChange={(values) => field.onChange(values.floatValue)}
          onChange={() => null}
        />
      </div>
    </div>
  );
};

export const PriceComponent = ({ field, form }: FieldProps) => {
  return (
    <NumberFormat
      name={field.name}
      thousandSeparator
      value={field.value}
      onValueChange={(val) => form.setFieldValue(field.name, val.floatValue || 0)}
    />
  );
};
