import { useNavigate } from "react-router-dom"
import styled from "styled-components"

const PlainButton = styled.button`
  border: none;
`

const UnauthorizedPage = () => {
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

  return (
    <section>
      <h1>Unauthorized</h1>
      <br />
      <p>You do not have access to requested page</p>
      <PlainButton onClick={goBack}>Go Back</PlainButton>
    </section>
  )
}

export default UnauthorizedPage