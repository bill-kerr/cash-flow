import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { connect } from 'react-redux';
import { createSchedule } from '../../actions/schedules';
import { fetchOccurrences } from '../../actions/occurrences';

const CreateScheduleForm = ({ createSchedule, dismiss }) => {

  const initialFormValues = {
    amount: '0.00',
    description: '',
    frequency: 'DAILY',
    startDate: '2020-05-01'
  };

  const validate = values => {
    const errors = {};
    if (!values.amount) {
      errors.amount = 'The amount field is required.';
    }
    return errors;
  };

  const onSubmit = (values, { setSubmitting, resetForm }) => {
    createSchedule(values).then(() => {
      fetchOccurrences();
      resetForm();
      setSubmitting(false);
      dismiss();
    });
  };

  return (
    <div>
      <div className="p-4 bg-gray-700 text-white rounded">
        <h2 className="font-bold">Create transaction schedule</h2>
      </div>
      <Formik
        initialValues={ initialFormValues }
        validate={ validate }
        onSubmit={ onSubmit }
      >
        {({ isSubmitting, resetForm }) => (
          <Form className="text-sm">
            <div className="p-4">
              <div className="flex items-center">
                <label className="block w-32 text-right text-gray-800">Amount</label>
                <Field 
                  type="text" 
                  name="amount"
                  className="ml-2 form-input" 
                />
                <ErrorMessage name="amount" component="div" />
              </div>
              <div className="mt-4 flex items-center">
                <label className="block w-32 text-right text-gray-800">Description</label>
                <Field type="text" name="description" className="ml-2 form-input" />
                <ErrorMessage name="description" component="div" />
              </div>
              <div className="mt-4 flex items-center">
                <label className="block w-32 text-right text-gray-800">Frequency</label>
                <Field type="text" name="frequency" className="ml-2 form-input" />
                <ErrorMessage name="frequency" component="div" />
              </div>
              <div className="mt-4 flex items-center">
                <label className="block w-32 text-right text-gray-800">Start Date</label>
                <Field type="text" name="startDate" className="ml-2 form-input" />
                <ErrorMessage name="startDate" component="div" />
              </div>
            </div>
            <div className="p-4 rounded flex justify-end bg-gray-200">
              <button 
                className=""
                type="button"
                disabled={ isSubmitting }
                onClick={ () => resetForm() }
              >
                Cancel
              </button>
              <button 
                className="px-3 py-2 text-white font-bold rounded bg-blue-700 shadow" 
                type="submit" 
                disabled={ isSubmitting }
              >
                Submit
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default connect(
  null,
  { createSchedule }
)(CreateScheduleForm);