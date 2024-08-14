import React from 'react';
import notfound from '../assets/SwimmingPool/404-error-dribbble-800x600.gif'

const NotFound: React.FC = () => {
  return (
    <div>
      <h2>404 - Page Not Found</h2>
      <img src={notfound}  />
    </div>
  );
};

export default NotFound;