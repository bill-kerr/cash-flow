import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { isString } from 'lodash';
import { useSpring, animated } from 'react-spring';

interface ModalProps {
  children: (modalBag: ModalBag) => React.ReactNode;
  element: HTMLElement | string | null;
  onDismiss?: () => void;
  onDismissed?: () => void;
}

interface ModalBag {
  isDismissing: boolean;
  dismiss: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, element, onDismiss, onDismissed }) => {
  const [isDismissing, setIsDismissing] = useState(false);
  const domElement = isString(element) ? document.getElementById(element) : element;

  const animationProps = useSpring({
    to: async (next: any) => {
      await next({ opacity: isDismissing ? 0 : 1 });
      if (isDismissing && onDismissed) {
        onDismissed();
      }
    },
    from: { opacity: 0 },
    config: { tension: 250, clamp: true },
  });

  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      dismiss();
    }
  };

  const dismiss = () => {
    setIsDismissing(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  const renderModal = () => {
    return (
      <animated.div
        className="flex items-center justify-center fixed z-50 bg-gray-900 bg-opacity-50 top-0 bottom-0 right-0 left-0"
        onClick={handleClickOutside}
        style={animationProps}
      >
        {children({ isDismissing, dismiss })}
      </animated.div>
    );
  };

  return domElement ? createPortal(renderModal(), domElement) : null;
};
