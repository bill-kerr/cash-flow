import React from 'react';
import { connect } from 'react-redux';
import { fetchOccurrences } from '../../actions';

class OccurrenceList extends React.Component {
  componentDidMount() {
    const items = this.props.fetchOccurrences();
  }

  render() {
    return <div>OccurrenceList</div>;
  }
}

const mapStateToProps = (state) => {
  return { occurrences: state.occurrences }
};

export default connect(
  mapStateToProps,
  { fetchOccurrences }
)(OccurrenceList);