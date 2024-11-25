import Link from "next/link";
import { MdError } from "react-icons/md";

export default function NotFound() {
  return (
    <section className="container">
      <div className="flex flex-col items-center py-24">
        <MdError className="flex-initial w-24 h-24 text-red-500 dark:text-red-400" />
        <h1 className="text-2xl font-bold text-center text-red-500 dark:text-red-400">
          Course not found
        </h1>
        <p className="mt-4 text-lg font-medium text-center text-body-color">
          Take me back to{" "}
          <Link href="/" className="text-primary">
            home
          </Link>
        </p>
      </div>
    </section>
  );
}
