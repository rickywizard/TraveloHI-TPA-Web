import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(100%); /* Geser ke bawah sejauh tinggi komponen */
    opacity: 0;
  }
  to {
    transform: translateY(0); /* Kembali ke posisi normal */
    opacity: 1;
  }
`;

const MessageContainer = styled.div<{ type: 'success' | 'error' }>`
  position: fixed;
  width: 50%;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => (props.type === 'success' ? '#4CAF50' : '#f44336')};
  color: var(--white);
  padding: 0.75rem;
  border-radius: 5px;
  text-align: center;
  z-index: 101;
  animation: ${slideIn} 0.5s ease-out forwards;
`;

interface MessageProps {
  type: 'success' | 'error';
  text: string;
}

const PopMessage: React.FC<MessageProps> = ({ type, text }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return visible ? <MessageContainer type={type}>{text}</MessageContainer> : null;
};

export default PopMessage;
