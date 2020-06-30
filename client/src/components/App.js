import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import OccurrenceList from './occurrences/OccurrenceList';
import auth from '../apis/auth';
import { signIn, fetchOccurrences, fetchSchedules } from '../actions';
import ScheduleList from './schedules/ScheduleList';
import StateForm from './StateForm';

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

      this.fetchData()
    });
  }

  fetchData() {
    const { token } = this.props.user;
    this.props.fetchSchedules(token);
    this.props.fetchOccurrences(token, '2020-05-01', '2021-04-30');
  }

  render() {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <Header />
        <div>
          <ScheduleList />
        </div>
        <div>
          <StateForm />
        </div>
        <div>
          <OccurrenceList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps,
  { signIn, fetchOccurrences, fetchSchedules }
)(App);