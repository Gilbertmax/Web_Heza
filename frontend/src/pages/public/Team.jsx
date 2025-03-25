import React from 'react';
import TeamMembers from '../../components/Team';

const Team = () => {
  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <div className="text-center pb-2">
          <h6 className="text-uppercase">Nuestro Equipo</h6>
          <h1 className="mb-4">Conoce a nuestros expertos</h1>
        </div>
        <TeamMembers />
      </div>
    </div>
  );
};

export default Team;