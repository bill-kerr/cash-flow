import React from 'react';
import { connect } from 'react-redux';
import { fetchSchedules } from '../../actions';

class ScheduleList extends React.Component {
  
  componentDidMount() {
    this.fetchSchedules();
  }

  componentDidUpdate() {
    this.fetchSchedules();
  }

  fetchSchedules() {
    if (this.props.user.isSignedIn) {
      this.props.fetchSchedules(this.props.user.token);
    }
  }

  renderList() {
    return this.props.schedules.map(schedule => {
      return (
        <div key={ schedule.id } className="w-full py-2 pl-4">
          { schedule.description }
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        { this.renderList() }
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