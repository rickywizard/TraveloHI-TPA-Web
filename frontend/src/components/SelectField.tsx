import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

interface SelectFieldProps {
  labelName: string;
  name: string;
  options: { value: string; label: string }[];
  value: string;
  handleChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectContainer = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text); /* Sesuaikan dengan warna yang diinginkan */
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--grey); /* Sesuaikan dengan warna yang diinginkan */
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: 0;
  color: var(--text); /* Sesuaikan dengan warna yang diinginkan */

  &:focus {
    border-color: var(--blue); /* Sesuaikan dengan warna yang diinginkan */
    box-shadow: 0 0 0 0.125em rgba(66, 153, 225, 0.25); /* Sesuaikan dengan warna yang diinginkan */
  }
`;

const SelectField: React.FC<SelectFieldProps> = ({ labelName, name, options, value, handleChange }) => {
  return (
    <SelectContainer>
      <Label htmlFor={name}>{labelName}</Label>

      <Select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </Select>
    </SelectContainer>
  );
};

export default SelectField;
