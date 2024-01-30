import { useAuth } from "../../context/AuthContext"

const HomePage = () => {
  const {user} = useAuth()

  return (
    <div>
      {user ? (
        <div>
          {user?.first_name} {user?.last_name}
        </div>
        ) : (
        <div>
          No user
        </div>
      )}
    </div>
  )
}

export default HomePage