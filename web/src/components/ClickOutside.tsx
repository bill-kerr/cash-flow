import React, { useCallback, useEffect, useRef } from 'react';

interface ClickOutsideProps {
  onClose: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

export const ClickOutside: React.FC<ClickOutsideProps> = ({ onClose, isOpen, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  const clickListener = useCallback(
    (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const escapeListener = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.addEventListener('click', clickListener);
    document.addEventListener('keyup', escapeListener);

    return () => {
      document.removeEventListener('click', clickListener);
      document.removeEventListener('keyup', escapeListener);
    };
  }, [isOpen, clickListener, escapeListener]);

  return <div ref={ref}>{children}</div>;
};
