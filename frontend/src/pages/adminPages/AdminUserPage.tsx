import { useEffect, useState } from "react";
import styled from "styled-components";
import { IUser } from "../../interfaces/user-interface";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Title = styled.h2`
  color: var(--text);
  margin-bottom: 1rem;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 1rem;
    text-align: left;
  }

  th {
    background-color: var(--blue);
    color: var(--white);
  }

  tbody tr {
    background-color: var(--white);
  }

  button {
    padding: 0.5rem;
    cursor: pointer;
    background-color: var(--blue);
    color: var(--white);
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: var(--blue-shade);
  }
`;

const AdminUserPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/auth/get_users",
          { withCredentials: true }
        );
        
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUnban = async (userId: number) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/ban_unban_user/${userId}`,
        {},
        { withCredentials: true }
      );

      console.log(response.data.message);
      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, is_active: !user.is_active } : user
          )
        );
      }
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
    }
  };

  return (
    <>
      <Title>Manage User Page</Title>
      <Table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Subscribe Status</th>
            <th>Active Status</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user.id !== loggedInUser?.id)
            .map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>
                  {user.first_name} {user.last_name}
                </td>
                <td>{user.is_subscriber ? "Subscribed" : "Not Subscribed"}</td>
                <td>
                  <button onClick={() => handleBanUnban(user.id)}>
                    {user.is_active ? "Ban" : "Unban"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default AdminUserPage;
