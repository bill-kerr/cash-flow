import React from 'react';
import { Formik, Form } from 'formik';
import { NumberField } from '../forms/NumberField';
import { useTypedDispatch } from '../../store';
import { setCurrentCash } from '../../store/settings/actions';

interface CashFormValues {
  cash: number;
}

export const CurrentCash: React.FC = () => {
  const dispatch = useTypedDispatch();

  const onSubmit = (values: CashFormValues) => {
    dispatch(setCurrentCash(values.cash));
  };

  return (
    <div>
      <Formik initialValues={{ cash: 0 }} onSubmit={onSubmit}>
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
