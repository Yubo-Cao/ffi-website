import RegisterPage from "@/components/RegisterPage";
import { NAME } from "@/lib/constants";

export const metadata = {
  title: `Register for ${NAME}`,
  description: `Register for ${NAME}`,
};

export default function Register() {
  return <RegisterPage />;
}
