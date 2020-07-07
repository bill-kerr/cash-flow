import React from 'react';
import { Field, reduxForm } from 'redux-form';

class CreateScheduleForm extends React.Component {
  renderError = ({ error, touched }) => {
    if (touched && error) {
      return (
        <div>{ error }</div>
      );
    }
  };

  renderInput = ({ input, label, meta }) => {
    return (
      <div>
        <label>{ label }</label>
        <input { ...input } autoComplete="off" />
        { this.renderError(meta) }
      </div>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    return (
      <form
        onSubmit={ this.props.handleSubmit(this.onSubmit) }
      >
        <Field
          name="amount"
          component={ this.renderInput }
          label="Amount"
        />
        <button>
          Submit
        </button>
      </form>
    );
  }
}

const validate = formValues => {
  const errors = {};

  if (!formValues.amount) {
    errors.amount = 'Please enter an amount.'
  }

  return errors;
};

export default reduxForm({
  form: 'createScheduleForm',
  validate
})(CreateScheduleForm);