import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchOccurrences } from '../../actions/occurrences';
import Occurrence from './OccurrenceItem';

class OccurrenceList extends React.Component {

  componentDidMount() {
    if (this.props.user.isSignedIn) {
      this.fetchOccurrences();
    }
  }

  fetchOccurrences() {
    const startDate = moment(this.props.startDate).format('YYYY-MM-DD');
    const endDate = moment(this.props.endDate).format('YYYY-MM-DD');
    this.props.fetchOccurrences(this.props.user.token, startDate, endDate);
  }

  renderList() {
    let balance = this.props.startingBalance;
    return this.props.occurrences.map((occurrence, i) => {
      balance += occurrence.amount;
      return (
        <Occurrence 
          key={ i } 
          occurrence={ occurrence } 
          balance={ balance } 
        />
      );
    });
  }

  render() {
    return (
      <table className="table-fixed min-w-full shadow rounded bg-gray-200" cellPadding="0" cellSpacing="0">
        <thead className="w-full">
          <tr className="w-full text-xs text-gray-600 uppercase tracking-wider text-left">
            <th className="w-1/6 py-3 pl-4">Date</th>
            <th className="w-auto py-3 pl-2">Description</th>
            <th className="w-1/5 py-3">Amount</th>
            <th className="w-1/5 py-3">Balance</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          { this.renderList() }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = state => {
  return { 
    occurrences: state.occurrenceList.occurrences,
    startDate: state.occurrenceList.startDate,
    endDate: state.occurrenceList.endDate,
    startingBalance: state.occurrenceList.startingBalance,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { fetchOccurrences }
)(OccurrenceList);