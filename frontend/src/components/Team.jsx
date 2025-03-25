import React from 'react';
import { Carousel } from 'react-bootstrap';
import team1 from '../assets/img/team-1.jpg';
import team2 from '../assets/img/team-2.jpg';

const TeamMembers = () => {
  const members = [
    { img: team1, name: "Nombre Ejecutivo 1", position: "Especialista Fiscal" },
    { img: team2, name: "Nombre Ejecutivo 2", position: "Consultor Corporativo" }
  ];

  return (
    <div className="container-fluid py-5">
      <div className="container py-5">
        <Carousel indicators={false} interval={null} className="owl-carousel team-carousel position-relative">
          {members.map((member, index) => (
            <Carousel.Item key={index}>
              <div className="team-item text-center bg-white rounded overflow-hidden pt-4">
                <div className="team-img position-relative">
                  <img className="img-fluid" src={member.img} alt={member.name} />
                  <div className="team-social">
                    {/* Agrega tus íconos sociales aquí */}
                  </div>
                </div>
                <h5 className="mt-4 mb-2 px-4">{member.name}</h5>
                <p className="mb-3 px-4 text-secondary">{member.position}</p>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default TeamMembers;