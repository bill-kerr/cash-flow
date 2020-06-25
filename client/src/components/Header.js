import React from 'react';
import { connect } from 'react-redux';

const Header = props => {
  return (
    <div class="flex justify-between">
      <div>Site Title</div>
      <div>
        <img src={ props.user.photoURL } />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(
  mapStateToProps
)(Header);