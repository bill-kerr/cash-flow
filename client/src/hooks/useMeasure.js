import { useRef, useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

function useMeasure() {
  const ref = useRef();
  const [bounds, setBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const resizeObserver = useState(() => new ResizeObserver(entry => setBounds(entry.contentRect)));

  useEffect(() => (resizeObserver.observe(ref.current), resizeObserver.disconnect), []);

  return [{ ref }, bounds];
};

export { useMeasure };