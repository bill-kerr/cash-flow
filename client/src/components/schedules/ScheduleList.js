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
      <div>
        { this.renderScheduleItems() }
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