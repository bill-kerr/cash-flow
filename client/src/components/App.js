import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import Header from './Header';
import OccurrenceList from './occurrences/OccurrenceList';
import auth from '../apis/auth';
import { signIn } from '../actions/auth';
import { fetchOccurrences } from '../actions/occurrences';
import { fetchSchedules } from '../actions/schedules';
import ScheduleList from './schedules/ScheduleList';
import OccurrenceListFilter from './occurrences/OccurrenceListFilter';
import Toolbar from './Toolbar';

class App extends React.Component {
  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      const token = await auth.getIdToken();
      await this.props.signIn({
        token,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        isSignedIn: true
      });

      this.fetchData();
    });
  }

  fetchData() {
    const { token } = this.props.user;
    this.props.fetchSchedules(token);
    const startDate = moment(this.props.occurrenceList.startDate).format('YYYY-MM-DD');
    const endDate = moment(this.props.occurrenceList.endDate).format('YYYY-MM-DD');
    this.props.fetchOccurrences(startDate, endDate);
  }

  render() {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <Header />
        <div className="mt-4">
          <Toolbar />
        </div>
        <div className="mt-4">
          <ScheduleList />
        </div>
        <div className="mt-4">
          <OccurrenceListFilter />
        </div>
        <div className="mt-4">
          <OccurrenceList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    occurrenceList: state.occurrenceList
  };
};

export default connect(
  mapStateToProps,
  { signIn, fetchOccurrences, fetchSchedules }
)(App);