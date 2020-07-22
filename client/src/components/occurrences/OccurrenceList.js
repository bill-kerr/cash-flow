import React from 'react';
import { connect } from 'react-redux';
import { fetchOccurrences } from '../../actions/occurrences';
import OccurrenceItem from './OccurrenceItem';
import { formatCurrency, formatDate } from '../../util';
import OccurrenceListFilter from './OccurrenceListFilter';

class OccurrenceList extends React.Component {

  componentDidMount() {
    if (this.props.user.isSignedIn) {
      this.fetchOccurrences();
    }
  }

  fetchOccurrences() {
    const startDate = formatDate(this.props.startDate);
    const endDate = formatDate(this.props.endDate);
    this.props.fetchOccurrences(startDate, endDate);
  }

  renderList() {
    let balance = this.props.startingBalance;
    return this.props.occurrences.map((occurrence, i) => {
      balance += occurrence.amount;
      return (
        <OccurrenceItem 
          key={ i } 
          occurrence={ occurrence } 
          balance={ balance } 
        />
      );
    });
  }

  render() {
    return (
      <div>
        <OccurrenceListFilter />
        <table 
          className="table-fixed min-w-full shadow rounded-b bg-gray-700" 
          cellPadding="0" 
          cellSpacing="0"
        >
          <thead className="w-full">
            <tr className="w-full text-xs text-gray-300 uppercase tracking-wider text-left">
              <th className="w-1/6 py-3 pl-4">Date</th>
              <th className="w-auto py-3 pl-2">Description</th>
              <th className="w-1/12 py-3 pl-2 text-right">Amount</th>
              <th className="w-1/12 py-3 pl-2 text-right">Balance</th>
              <th className="w-1/5 py-3 pl-2 pr-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <tr className="text-sm font-bold">
              <td className="py-2 pl-4 whitespace-no-wrap">{ formatDate(this.props.startDate) }</td>
              <td className="py-2 pl-2 whitespace-no-wrap"></td>
              <td className="py-2 pl-2 whitespace-no-wrap text-right"></td>
              <td className="py-2 pl-2 whitespace-no-wrap text-right">
                { formatCurrency(this.props.startingBalance, this.props.currencyCode) }
              </td>
              <td className="py-2 pl-2 whitespace-no-wrap text-right"></td>
            </tr>
            { this.renderList() }
          </tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { 
    occurrences: state.occurrenceList.occurrences,
    startDate: state.occurrenceList.startDate,
    endDate: state.occurrenceList.endDate,
    startingBalance: state.occurrenceList.startingBalance,
    user: state.auth.user,
    currencyCode: state.settings.currencyCode
  };
};

export default connect(
  mapStateToProps,
  { fetchOccurrences }
)(OccurrenceList);