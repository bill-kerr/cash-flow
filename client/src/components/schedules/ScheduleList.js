import React from 'react';
import { connect } from 'react-redux';
import { fetchSchedules } from '../../actions/schedules';
import ScheduleItem from './ScheduleItem';

class ScheduleList extends React.Component {
  
  componentDidMount() {
    this.fetchSchedules();
  }

  fetchSchedules() {
    if (this.props.user.isSignedIn) {
      this.props.fetchSchedules(this.props.user.token);
    }
  }

  renderScheduleItems() {
    return this.props.schedules.map(schedule => {
      return (
        <ScheduleItem key={ schedule.id } schedule={ schedule } />
      );
    });
  }

  renderCreateTransaction() {
    if (this.props.schedules.length > 3) return;

    return (
      <div 
        className="flex flex-col w-full rounded text-blue-900 mx-2 border-2 border-blue-500 border-dashed p-2 hover:bg-blue-100 cursor-pointer text-center" 
        style={{ maxWidth: '16rem' }}
      >
        <div className="bg-blue-200 rounded-full p-3 self-center mt-2">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            stroke="currentColor" className="h-4 w-4"
          >
            <path d="M12 4v16m8-8H4"></path>
          </svg>
        </div>
        <span className="mt-1 font-bold">Create a Transaction</span>
        <span className="mb-2 text-xs text-gray-500">to get started...</span>
      </div>
    );
  }

  renderBlanks() {
    const numBlanks = 3 - this.props.schedules.length;
    if (numBlanks <= 0) return;

    const renderedBlanks = [];
    for (let i = 0; i < numBlanks; i++) {
      renderedBlanks.push(
        <div 
          key={ i }
          className="flex flex-col w-full rounded text-gray-900 mx-2 border-2 border-gray-500 border-dashed p-2 text-center" 
          style={{ maxWidth: '16rem' }}
        >
          
        </div>
      );
    }

    return renderedBlanks;
  }

  render() {
    return (
      <div className="flex items-center items-stretch justify-between -mx-1">
        <div className="flex items-center justify-center w-8 mx-1 text-gray-500 rounded cursor-pointer hover:text-gray-600">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            stroke="currentColor" className="h-8 w-8"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
        { this.renderScheduleItems() }
        { this.renderCreateTransaction() }
        { this.renderBlanks() }
        <div className="flex items-center justify-center w-8 mx-1 text-gray-500 rounded cursor-pointer hover:text-gray-600">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            stroke="currentColor" className="h-8 w-8">
            <path d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    schedules: state.schedules
  };
};

export default connect(
  mapStateToProps,
  { fetchSchedules }
)(ScheduleList);