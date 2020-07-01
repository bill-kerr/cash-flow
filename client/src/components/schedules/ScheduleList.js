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

  render() {
    return (
      <div className="flex items-center items-stretch justify-between -mx-1">
        <div className="flex items-center w-32 mx-1 text-gray-500 rounded cursor-pointer hover:bg-gray-200 hover:shadow">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" 
            stroke="currentColor" className="h-8 w-8"
          >
            <path d="M15 19l-7-7 7-7"></path>
          </svg>
        </div>
        { this.renderScheduleItems() }
        <div className="flex items-center w-32 mx-1 text-gray-500 rounded cursor-pointer hover:bg-gray-200 hover:shadow">
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