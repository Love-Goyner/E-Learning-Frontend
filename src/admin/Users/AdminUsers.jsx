import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { server } from "../../main";
import axios from "axios";
import Layout from "../Utils/Layout";

const AdminUsers = ({ user }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${server}/api/users`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setUsers(data.users);
    } catch (error) {
      console.log(error);
    }
  };

  const updateRole = async (id) => {
    if(confirm("are you sure you want to update this user role")){
        try {
            const {data} = await axios.put(`${server}/api/user/${id}`, {} , {
                headers : {
                    token : localStorage.getItem("token")
                }
            })

            toast.success(data.message);
            fetchUsers();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
  }

  useEffect(() => {
    if (user && user.role !== "admin" && user.mainrole !== "superadmin")
      return navigate("/");
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        <table border={"black"}>
          <thead>
            <tr>
              <td>#</td>
              <td>name</td>
              <td>email</td>
              <td>role</td>
              <td>update role</td>
            </tr>
          </thead>

          {users &&
            users.map((e, i) => (
              <tbody key={e._id}>
                <tr>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>
                    <button
                      onClick={() => updateRole(e._id)}
                      className="common-btn"
                    >
                      Update Role
                    </button>
                  </td>
                </tr>
              </tbody>
            ))}
        </table>
      </div>
    </Layout>
  );
};

export default AdminUsers;
