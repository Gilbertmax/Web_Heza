import React, { useState, useEffect } from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import './TimeInput.css';

const TimeInput = ({ value, onChange }) => {
  const [hours, minutes] = value.split(':');
  const hourNum = parseInt(hours, 10);
   
  const [isPM, setIsPM] = useState(hourNum >= 12);
  const [displayHour, setDisplayHour] = useState(
    hourNum === 0 ? '12' : hourNum > 12 ? (hourNum - 12).toString().padStart(2, '0') : hourNum.toString().padStart(2, '0')
  );
 
  useEffect(() => {
    const currentHourNum = parseInt(hours, 10);
    if (isPM && currentHourNum < 12) {
      onChange(`${(currentHourNum + 12).toString().padStart(2, '0')}:${minutes}`);
    } else if (!isPM && currentHourNum >= 12) {
      onChange(`${(currentHourNum - 12 || 0).toString().padStart(2, '0')}:${minutes}`);
    }
  }, [isPM, hours, minutes, onChange]);
  
  const handleHourChange = (e) => {
    const newHour = e.target.value;
    const newHourNum = parseInt(newHour, 10);
    setDisplayHour(newHour);
     
    const hour24 = isPM && newHourNum < 12 
      ? newHourNum + 12 
      : (!isPM && newHourNum === 12) ? 0 : newHourNum;
     
    onChange(`${hour24.toString().padStart(2, '0')}:${minutes}`);
  };
  
  const handleMinuteChange = (e) => {
    const newMinutes = e.target.value;
    onChange(`${hours}:${newMinutes}`);
  };
  
  const toggleAmPm = () => {
    setIsPM(!isPM);
  };
 
  return (
    <InputGroup className="time-picker">
      <Form.Select 
        value={displayHour} 
        onChange={handleHourChange}
        aria-label="Seleccionar hora"
        className="time-select"
      >
        {Array.from({ length: 12 }, (_, i) => {
          const hour = (i + 1).toString().padStart(2, '0');
          return (
            <option key={hour} value={hour}>
              {hour}
            </option>
          );
        })}
      </Form.Select>
       
      <InputGroup.Text>:</InputGroup.Text>
       
      <Form.Select
        value={minutes}
        onChange={handleMinuteChange}
        aria-label="Seleccionar minutos"
        className="time-select"
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
       
      <Button 
        variant={isPM ? "primary" : "outline-primary"} 
        onClick={toggleAmPm}
        className="am-pm-toggle"
      >
        {isPM ? 'PM' : 'AM'}
      </Button>
    </InputGroup>
  );
};

export default TimeInput;