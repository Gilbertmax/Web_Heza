// Simplify the Loading component to focus on core functionality
import React from 'react';
import PropTypes from 'prop-types';
import './Loading.css';

const Loading = ({ fullScreen, message }) => (
  <div 
    className={`loading-container ${fullScreen ? 'full-screen' : ''}`}
    role="status"
    aria-live="polite"
  >
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
    {message && <div className="loading-text">{message}</div>}
  </div>
);

Loading.propTypes = {
  message: PropTypes.string,
  fullScreen: PropTypes.bool
};

export default Loading;