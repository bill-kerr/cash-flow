import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Modal = props => {
  const [animating, setAnimating] = useState(true);

  const onDismiss = () => {
    props.dismiss();
    setAnimating(true);
  };

  const renderChildren = () => {
    return animating || props.show ? props.children : null;
  };

  const renderModal = () => {
    return (
      <div 
        className="p-6 absolute flex items-center justify-center bg-gray-900 top-0 bottom-0 left-0 right-0 transition-all duration-300 ease-in-out bg-opacity-25"
        onClick={ onDismiss }
        style={{ 
          pointerEvents: props.show ? 'auto' : 'none',
          opacity: props.show ? 1 : 0
        }}
      >
        <div
          className="mx-auto fixed bg-white w-4/5 max-w-screen-md rounded shadow transition-all duration-300 ease-in-out"
          style={{
            transform: props.show ? 'scale(1, 1)' : 'scale(0, 0)'
          }}
          onClick={ e => e.stopPropagation() }
          onTransitionEnd={ () => setAnimating(false) }
        >
          { renderChildren() }
        </div>
      </div>
    );
  };

  return ReactDOM.createPortal(
    renderModal(),
    document.getElementById('modal')
  );
};

export default Modal;