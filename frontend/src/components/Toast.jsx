import React, { useEffect } from 'react';

/**
 * Toast notification - shows message then hides after delay.
 * type: 'success' | 'error' | 'info'
 */
function Toast({ message, type = 'info', onClose, duration = 3000 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div className={`toast toast-${type}`} role="alert">
      {message}
    </div>
  );
}

export default Toast;
