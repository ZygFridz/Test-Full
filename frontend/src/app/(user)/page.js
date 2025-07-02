"use client"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSession } from "../../context/userContext";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const { session, setSession } = useSession();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState({});
  const [openForm, setOpenForm] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3005/users", {
        headers: {
          Authorization: `Bearer ${token}` 
        },
      });

      const data = await res.json()

      if (!res.ok) {
        console.error("Fetch failed:", data?.msg || res.statusText);
        setUsers([]);  // ป้องกันการโยน error ใน map
        return;
      }

      if (!Array.isArray(data)) {
      console.error("Unexpected data format:", data);
      setUsers([]);
      return;
      }
    
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const onSubmit = async (data) => {
    try {
      const resp = await await fetch("http://localhost:3005/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
      });

      if (!resp.ok) {
        throw new Error("Failed to add user");
      }

      const newUser = await resp.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);

    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  const onEditSubmit = async () => {
    try {
      const resp = await fetch(`http://localhost:3005/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        throw new Error("Failed to update user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? editingUser : user
        )
      );

      setEditingUser(null);
      setOpenForm("");

    } catch (err) {
      console.error("Error updating user", err);
    }
  };

  // const onSubmit = async (data) => {
  //   try {
  //     if (editingUser) {
  //       await fetch(http://localhost:3005/users/${editingUser.id}, {
  //         method: "put",
  //         headers: {
  //           "Content-Type": "application/json",
  //         }, //กำหนด method + header ถ้าไม่กำหนดจะเป็น get โดยอัตโนมัติ
  //         body: JSON.stringify(data)
  //       });
  //     } else {
  //       await fetch("http://localhost:3005/users", {
  //         method: "post",
  //         headers: {
  //           "Content-Type": "application/json",
  //         }, //กำหนด method + header ถ้าไม่กำหนดจะเป็น get โดยอัตโนมัติ
  //         body: JSON.stringify(data)
  //       });
  //     }
  //     reset();
  //     fetchUsers();
  //   } catch (err) {
  //     console.error("Error saving user", err);
  //   }
  // };

  // const handleEdit = (user) => {

  const handleEdit = (data) => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }
    setEditingUser(data);
    setOpenForm("edit");
  }
  const handleDelete = async (id) => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const resp = await fetch(`http://localhost:3005/users/${id}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove user from local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");   // ลบ token ออกจาก localStorage
    if (typeof setSession === "function") {
      setSession(null);                   // เคลียร์ context user ถ้ามี
    }
    setIsLoggedIn(false);
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);
    fetchUsers();

  }, []);

  useEffect(() => {
    if (openForm === "add") {
      reset(); // เคลียร์ค่าทุก input
    }
  }, [openForm]);

  useEffect(() => {
    if (openForm === "edit" && editingUser) {
      reset({
        username: editingUser.username,
        email: editingUser.email,
        role: editingUser.role
      });
    }
  }, [openForm, editingUser]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Users List</h1>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {!isLoggedIn ? (
              <>
                <Link
                  href={{
                    pathname: '/login',
                  }}>
                  <button
                    className="bg-gray-700 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 cursor-pointer"
                  >
                    Login
                  </button>
                </Link>
                <Link
                  href={{
                    pathname: '/register',
                  }}>
                  <button
                    className="bg-gray-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 cursor-pointer"
                  >
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <>
                {isLoggedIn && session?.user?.role === "admin"  && (
                  <button
                    onClick={() => {
                      setOpenForm("add");
                    }}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 cursor-pointer"
                  >
                    Add User
                  </button>
                )}
                <span className="text-gray-700 font-medium">
                  {session?.user?.username }
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 cursor-pointer"
                >
                  Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
      {
        openForm === "add" && (
          <div className="card bg-white rounded-md border border-slate-200 p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Add New User
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="Username"
                  {...register("username", { required: "Username is required" })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>
              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="Email"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="Role"
                  {...register("role", { required: "Role is required" })}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 cursor-pointer w-32"
                >
                  Add User
                </button>
                <button
                  type="button"
                  onClick={() => { setOpenForm("") }}
                  className="border px-4 py-1.5 rounded-md bg-gray-700 hover:bg-gray-800 text-white cursor-pointer w-32"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )
      }
      {
        openForm === "edit" && (
          <div className="card bg-white rounded-md border border-slate-200 p-6 mt-4">
            <h2 className="text-xl font-semibold mb-4">
              Edit User
            </h2>
            <form onSubmit={onEditSubmit} className="grid gap-4">
              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="username"
                  value={editingUser?.username}
                  {...register("username", { required: "username is required" })}
                  onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username.message}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="Email"
                  type="email"
                  value={editingUser?.email}
                  {...register("email", { required: "Email is required" })}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  className="w-full bg-slate-100 border border-slate-300 rounded-md px-3 py-2"
                  placeholder="Role"
                  value={editingUser?.role}
                  {...register("role", { required: "Role is required" })}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                />
                {errors.role && (
                  <p className="text-red-500 text-sm">{errors.role.message}</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-600 cursor-pointer w-32"
                >
                  Update User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser(null);
                    setOpenForm("");
                  }}
                  className="border px-4 py-1.5 rounded-md bg-gray-700 hover:bg-gray-800 text-white cursor-pointer w-32"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )
      }

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5">
        {Array.isArray(users) && users.map((user) => (
          <div key={user.id} className="card bg-white rounded-md border border-slate-200 p-5 ">
            <div className="card-body">
              <p className="font-semibold text-lg">{user.username} <span className="text-sm rounded-full px-3 py-px bg-gray-800 text-white">{user.role?.name}</span></p>
              <p className="text-slate-600">{user.email}</p>
            </div>
            {isLoggedIn && (
              <div className="btn-group flex justify-end gap-1.5 mt-3">
                {(
                  session?.user?.role == "admin" || 
                  (session?.user?.role == "user" && session?.user?.id == user.id)
                ) && (
                <button type="button" onClick={() => handleEdit(user)} className="bg-yellow-500 hover:bg-yellow-600 text-yellow-950 px-3 py-1.5 rounded-md  cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24"><path fill="currentColor" d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h6.525q.5 0 .75.313t.25.687t-.262.688T11.5 5H5v14h14v-6.525q0-.5.313-.75t.687-.25t.688.25t.312.75V19q0 .825-.587 1.413T19 21zm4-7v-2.425q0-.4.15-.763t.425-.637l8.6-8.6q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662l-8.6 8.6q-.275.275-.637.438t-.763.162H10q-.425 0-.712-.288T9 14m12.025-9.6l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z" /></svg>
                </button>
                )}
                {session?.user?.role === "admin" && (
                <button type="button" onClick={() => handleDelete(user.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md  cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1.25em" height="1.25em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" /></svg>
                </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}