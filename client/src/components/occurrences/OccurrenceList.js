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
        <div className="flex text-xs bg-gray-700 text-gray-300 uppercase tracking-wider text-left">
          <div className="w-1/6 py-3 pl-4 whitespace-no-wrap flex-shrink-0">Date</div>
          <div className="flex-grow py-3 pl-2 whitespace-no-wrap flex-shrink-0">Description</div>
          <div className="w-1/12 py-3 pl-2 whitespace-no-wrap text-right flex-shrink-0">Amount</div>
          <div className="w-1/12 py-3 pl-2 whitespace-no-wrap text-right flex-shrink-0">Balance</div>
          <div className="w-1/5 py-3 pl-2 whitespace-no-wrap pr-4 text-right flex-shrink-0">Actions</div>
        </div>
        <div className="flex text-sm font-bold bg-white">
          <div className="w-1/6 py-2 pl-4 whitespace-no-wrap flex-shrink-0">
            { formatDate(this.props.startDate) }
          </div>
          <div className="py-2 pl-2 flex-grow whitespace-no-wrap flex-shrink-0"></div>
          <div className="w-1/12 py-2 pl-2 whitespace-no-wrap text-right flex-shrink-0"></div>
          <div className="w-1/12 py-2 pl-2 whitespace-no-wrap text-right flex-shrink-0">
            { formatCurrency(this.props.startingBalance, this.props.currencyCode) }
          </div>
          <div className="w-1/5 py-2 pl-2 whitespace-no-wrap text-right flex-shrink-0"></div>
        </div>
        { this.renderList() }
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