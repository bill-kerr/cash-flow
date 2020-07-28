import React, { useRef, useEffect, useState } from "react";

const Tooltip = ({ content, topGap = "2px" }) => {
  const ref = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setWidth(ref.current ? ref.current.offsetWidth : 0);
    setHeight(ref.current ? ref.current.clientHeight : 0);
  }, []);

  return (
    <span
      className="tooltip-text bg-gray-900 bg-opacity-75 text-white rounded-sm p-2 leading-none pointer-events-none select-none"
      ref={ref}
      style={{
        marginTop: `calc(-200% - ${topGap})`,
        right: `calc(50% - ${width / 2}px)`,
      }}
    >
      {content}
      <svg
        className="absolute bottom-0 w-full inset-x-0 opacity-75 text-gray-900 h-2"
        x="0px"
        y="0px"
        viewBox="0 0 255 255"
        xmlSpace="preserve"
        style={{ top: `${height}px` }}
      >
        <polygon className="fill-current" points="0,0 127.5,127.5 255,0" />
      </svg>
    </span>
  );
};

export default Tooltip;
