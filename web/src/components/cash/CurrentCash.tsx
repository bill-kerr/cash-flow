import React from 'react';
import { Formik } from 'formik';
import { NumberField } from '../forms/NumberField';

interface CashFormValues {
  cash: number;
}

export const CurrentCash: React.FC = () => {
  const onSubmit = (values: CashFormValues) => {
    console.log(values);
  };

  return (
    <div>
      <Formik initialValues={{ cash: 0 }} onSubmit={onSubmit}>
        <NumberField name="cash" label="Current Cash" icon="$" />
      </Formik>
    </div>
  );
};
