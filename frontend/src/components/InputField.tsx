import React, { ChangeEvent } from "react";
import styled from "styled-components";

interface InputFieldProps {
  labelName: string;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  step?: string;
}

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 0.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--grey);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: 0;
  color: var(--text);

  &:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 0.125em rgba(66, 153, 225, 0.25);
  }
`;

const InputField: React.FC<InputFieldProps> = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  step,
}) => {
  return (
    <InputContainer>
      <Label htmlFor={name}>{labelName}</Label>

      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        step={step}
      />
    </InputContainer>
  );
};

export default InputField;
