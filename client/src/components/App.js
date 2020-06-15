import React from 'react';
import Header from './Header';
import OccurrenceList from './occurrences/OccurrenceList';

class App extends React.Component {
  render() {
    return (
      <div>
        <Header />
        <div className="w-full max-w-screen-xl mx-auto px-6">
          <OccurrenceList />
        </div>
      </div>
    );
  }
}

export default App;