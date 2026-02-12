import React from 'react';

function Spinner() {
  return (
    <div className="spinner-wrap">
      <div className="spinner" aria-hidden="true"></div>
      <span>Loading...</span>
    </div>
  );
}

export default Spinner;
