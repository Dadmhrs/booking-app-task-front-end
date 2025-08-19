import React from 'react';

//Organisms
import Header from './Header/header.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-[150vh]">
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
