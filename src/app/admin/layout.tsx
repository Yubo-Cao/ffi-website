import { getToken } from "@/lib/auth";
import { isAdmin } from "@/lib/user";
import { notFound } from "next/navigation";

export default async function Layout({ children }) {
  const token = await getToken();
  if (!token || !(await isAdmin(token.decodedToken.uid))) {
    return notFound();
  }

  return children;
}
