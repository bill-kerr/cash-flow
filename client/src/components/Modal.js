import React from 'react';
import ReactDOM, { render } from 'react-dom';

const Modal = props => {
  const renderedModal = () => (
    <div>
      hello
    </div>
  );

  return ReactDOM.createPortal(
    renderedModal(),
    document.getElementById('modal')
  );
};