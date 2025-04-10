import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';

const TimeInput = ({ value, onChange }) => {
  const [hours, minutes] = value.split(':');

  const handleHourChange = (e) => {
    const newHours = e.target.value;
    onChange(`${newHours}:${minutes}`);
  };

  const handleMinuteChange = (e) => {
    const newMinutes = e.target.value;
    onChange(`${hours}:${newMinutes}`);
  };

  return (
    <Row className="g-2">
      <Col>
        <Form.Select 
          value={hours} 
          onChange={handleHourChange}
          aria-label="Seleccionar hora"
        >
          {Array.from({ length: 24 }, (_, i) => {
            const hour = i.toString().padStart(2, '0');
            return (
              <option key={hour} value={hour}>
                {hour}
              </option>
            );
          })}
        </Form.Select>
      </Col>
      <Col>
        <Form.Select
          value={minutes}
          onChange={handleMinuteChange}
          aria-label="Seleccionar minutos"
        >
          {Array.from({ length: 60 }, (_, i) => {
            const minute = i.toString().padStart(2, '0');
            return (
              <option key={minute} value={minute}>
                {minute}
              </option>
            );
          })}
        </Form.Select>
      </Col>
    </Row>
  );
};

export default TimeInput;