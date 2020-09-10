import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { NumberField } from '../forms/NumberField';

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
        {({ submitForm }) => (
          <Form>
            <div className="flex items-center w-64">
              <label htmlFor="cash" className="whitespace-no-wrap">
                Current Cash:
              </label>
              <NumberField name="cash" icon="$" textAlign="right" customWrapperClasses="ml-2" onBlur={submitForm} />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
