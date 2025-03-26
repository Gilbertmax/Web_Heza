import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';

const AdminLoading = ({ 
  message = 'Verificando credenciales administrativas...',
  type = 'spiral',
  size = 'large',
  color = 'primary',
  fullScreen = true,
  textPosition = 'below',
  progress,
  showLogin = true
}) => {
  return (
    <Loading
      message={message}
      type={type}
      size={size}
      color={color}
      fullScreen={fullScreen}
      textPosition={textPosition}
      progress={progress}
      admin={true}
      showLogin={showLogin}
    />
  );
};

AdminLoading.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['spiral', 'dots', 'progress']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  color: PropTypes.oneOf(['primary', 'secondary', 'monochrome']),
  fullScreen: PropTypes.bool,
  textPosition: PropTypes.oneOf(['below', 'right', 'hidden']),
  progress: PropTypes.number,
  showLogin: PropTypes.bool
};

export default AdminLoading;