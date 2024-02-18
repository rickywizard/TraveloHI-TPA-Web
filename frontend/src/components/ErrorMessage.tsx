import styled from "styled-components";

const ErrorDiv = styled.div`
  color: red;
  font-size: 0.875rem;
  z-index: 100;
`;

const ErrorMessage = ({ error }: { error: string | null }) => {
  if (!error) {
    return null;
  }

  return <ErrorDiv>{error}</ErrorDiv>;
};

export default ErrorMessage;
