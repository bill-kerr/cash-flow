import React from 'react';
import { connect } from 'react-redux';
import { formatCurrency } from '../../util';

const OccurrenceItem = ({ occurrence, balance, currencyCode }) => {
  return (
    <tr className="text-sm">
      <td className="py-2 pl-4">{ occurrence.date }</td>
      <td className="py-2 pl-2">{ occurrence.description }</td>
      <td className="py-2">{ formatCurrency(occurrence.amount, currencyCode) }</td>
      <td className="py-2">{ formatCurrency(balance, currencyCode) }</td>
    </tr>
  );
};

const mapStateToProps = state => {
  return {
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps,
  {}
)(OccurrenceItem);