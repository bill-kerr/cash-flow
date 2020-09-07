import React, { useState } from 'react';

export const Dropdown: React.FC<React.HTMLProps<HTMLDivElement>> = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props} onClick={() => setOpen(!open)}>
      {children}
    </div>
  );
};
