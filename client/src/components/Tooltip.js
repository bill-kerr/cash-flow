import React, { useRef, useEffect, useState } from 'react';

// TODO: Fix the centering of the span.

const Tooltip = ({ content }) => {
  const ref = useRef();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 0);
  }, []);

  return (
    <span 
      className="tooltip-text bg-gray-900 bg-opacity-50 text-white rounded-sm p-2 leading-none -mt-8"
      ref={ ref }
      style={{ 
        marginTop: `-36px`,
        marginRight: `${ -width/2 }px`,
        marginLeft: `${ -width/2 }px`
      }}
    >
      { content }
      {/* <svg 
        className="absolute text-black h-2 w-full left-0 bottom-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xmlSpace="preserve"
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
      </svg> */}
    </span>
  );
};

export default Tooltip;