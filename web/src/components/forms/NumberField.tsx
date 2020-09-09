import React, { useState } from 'react';
import { Field, FieldProps } from 'formik';
import NumberFormat from 'react-number-format';

interface NumberFieldProps {
  name: string;
  label: string;
  labelPosition?: 'left' | 'top';
  textAlign?: 'left' | 'right' | 'middle';
  icon?: string | JSX.Element;
  iconPosition?: 'left' | 'right';
}

export const NumberField: React.FC<NumberFieldProps> = ({
  labelPosition = 'left',
  iconPosition = 'left',
  textAlign = 'left',
  ...props
}) => {
  const [inputElem, setInputElement] = useState<HTMLInputElement | null>(null);
  const containerDisplay = labelPosition === 'left' ? 'flex-row items-center' : 'flex-col';
  const inputMargin = labelPosition === 'left' ? 'ml-2' : 'mt-2';
  const iconDisplay = iconPosition === 'left' ? 'flex-row' : 'flex-row-reverse';
  const iconMargin = iconPosition === 'left' ? 'ml-2' : 'mr-2';
  const alignments = { left: 'text-left', right: 'text-right', middle: 'text-center' };
  const renderField = () => (
    <Field
      component={FormattedNumberInput}
      setInputElement={setInputElement}
      className={`p-2 tracking-wide h-full w-full bg-transparent rounded focus:outline-none ${alignments[textAlign]}`}
      {...props}
    />
  );

  return (
    <div className={`flex ${containerDisplay}`}>
      <label htmlFor={props.label} className="whitespace-no-wrap">
        {props.label}
      </label>
      <div
        className={`${inputMargin} relative flex ${iconDisplay} items-center w-full bg-gray-700 rounded focus-within:shadow-outline transition-shadow duration-100 cursor-text`}
        onFocus={() => inputElem?.select()}
        onClick={() => inputElem?.select()}
      >
        <span className={`${iconMargin} pointer-events-none`}>{props.icon}</span>
        {renderField()}
      </div>
    </div>
  );
};

interface FormattedNumberInputProps {
  setInputElement: (el: HTMLInputElement) => void;
}

const FormattedNumberInput: React.FC<FieldProps & FormattedNumberInputProps> = ({
  field,
  form,
  setInputElement,
  ...props
}) => {
  return (
    <NumberFormat
      {...props}
      thousandSeparator=","
      allowNegative={false}
      allowLeadingZeros={false}
      decimalScale={2}
      defaultValue={0}
      isNumericString={true}
      fixedDecimalScale={true}
      onValueChange={(val) => form.setFieldValue(field.name, val.floatValue || 0)}
      onFocus={(e) => e.target.select()}
      value={field.value}
      getInputRef={(el: HTMLInputElement) => setInputElement(el)}
    />
  );
};
