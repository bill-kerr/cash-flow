import React from 'react';
import { connect } from 'react-redux';

const Header = props => {
  return (
    <div className="flex items-center justify-between">
      <div className="pl-4 text-lg font-bold">
        Personal Cash Flow Tracker
      </div>
      <div className="flex justify-between">
        <img 
          src={ props.user.photoURL }
          className="h-12 w-12 rounded-full border-4 border-transparent hover:border-gray-300"
          alt="User avatar"
        />
        <div className="h-12 w-12 flex items-center justify-center">
          <svg fill="none" strokeLinecap="round" strokeLinejoin="round" 
            strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"
            className="h-8 w-8 text-gray-700"
          >
            <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
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