import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import auth from '../apis/auth';
import { signIn } from '../actions/auth';
import { fetchOccurrences } from '../actions/occurrences';
import { fetchSchedules } from '../actions/schedules';
import HomePage from '../pages/HomePage';
import { Router, Route, Switch } from 'react-router-dom';
import history from '../history';
import CreateSchedule from './schedules/CreateSchedule';
import { formatDate } from '../util';

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
    const startDate = formatDate(this.props.occurrenceList.startDate);
    const endDate = formatDate(this.props.occurrenceList.endDate);
    this.props.fetchOccurrences(startDate, endDate);
  }

  render() {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <Router history={ history }>
          <Header />
          <Switch>
            <Route path="/" exact component={ HomePage } />
            <Route path="/schedules/create" component={ CreateSchedule } />
          </Switch>
        </Router>
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