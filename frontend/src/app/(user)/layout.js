"use client"

import { UserProvider } from "../../context/userContext";

export default function UserLayout({ children }) {
  return <UserProvider>{children}</UserProvider>
}