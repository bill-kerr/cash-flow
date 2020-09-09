import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { NumberField } from '../forms/NewNumberField';

interface CashFormValues {
  cash: number;
}

export const CurrentCash: React.FC = () => {
  const onSubmit = (values: CashFormValues) => {
    console.log(values);
  };

  const validationSchema = Yup.object({
    cash: Yup.string().required('Please enter a number.'),
  });

  return (
    <div>
      <Formik initialValues={{ cash: 0 }} onSubmit={onSubmit} validationSchema={validationSchema}>
        {(formik) => (
          <Form>
            <NumberField name="cash" label="Current Cash" icon="$" />
            <div className="mt-2 p-2 text-sm text-gray-900 rounded bg-gray-300 font-mono">
              {JSON.stringify(formik, null, 2)}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
