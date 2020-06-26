import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { fetchOccurrences } from '../../actions';
import Occurrence from './Occurrence';

class OccurrenceList extends React.Component {
  componentDidMount() {
    if (this.props.user.isSignedIn) {
      this.props.fetchOccurrences();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.email !== this.props.user.email) {
      const startDate = moment().format('YYYY-MM-DD');
      const endDate = moment().add(1, 'years').format('YYYY-MM-DD');
      this.props.fetchOccurrences(this.props.user.token, startDate, endDate);
    }
  }

  renderList() {
    return this.props.occurrences.map((occurrence, i) => {
      return (
        <Occurrence key={ i } occurrence={ occurrence } balance={ 1000 } />
      );
    });
  }

  render() {
    return (
      <table className="table-fixed min-w-full" cellPadding="0" cellSpacing="0">
        <thead className="w-full bg-gray-200 rounded">
          <tr className="w-full border-b border-gray-300 text-xs text-gray-600 uppercase tracking-wider text-left">
            <th className="w-1/6 py-3 pl-4">Date</th>
            <th className="w-auto py-3 pl-2">Description</th>
            <th className="w-1/5 py-3">Amount</th>
            <th className="w-1/5 py-3">Balance</th>
          </tr>
        </thead>
        <tbody>
          { this.renderList() }
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return { 
    occurrences: state.occurrences,
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { fetchOccurrences }
)(OccurrenceList);