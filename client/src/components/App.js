import React from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import OccurrenceList from './occurrences/OccurrenceList';
import auth from '../apis/auth';
import { signIn } from '../actions';

class App extends React.Component {
  componentDidMount() {
    auth.onAuthStateChanged(async user => {
      const token = await auth.getIdToken();
      this.props.signIn({
        token,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      });
    });
    console.log(this.props.token)
  }

  render() {
    return (
      <div className="w-full max-w-screen-xl mx-auto px-6">
        <Header />
        <div>
          <OccurrenceList />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.token
  };
};

export default connect(
  mapStateToProps,
  { signIn }
)(App);