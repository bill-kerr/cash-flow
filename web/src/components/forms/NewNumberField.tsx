import React from 'react';
import { Field, FieldProps } from 'formik';
import NumberFormat from 'react-number-format';

interface NumberFieldProps {
  name: string;
  label: string;
  labelPosition?: 'left' | 'top';
  icon?: string | JSX.Element;
  iconPosition?: 'left' | 'right';
}

export const NumberField: React.FC<NumberFieldProps> = () => {
  return <Field component={customInputComponent} name="cash" className="bg-gray-900" />;
};

const customInputComponent = ({ field, form, ...props }: FieldProps) => {
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
    />
  );
};
