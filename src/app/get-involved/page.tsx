import Breadcrumb from "@/components/Common/Breadcrumb";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Get Involved | ${NAME}`,
  description: "Become a volunteer, leader, or partner with us.",
};

const GetInvolvedPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Get Involved"
        description="Become a volunteer, leader, or partner with us."
      />
      <section id="leader">
        <div className="container py-6 md:py-8 lg:py-10">
          <Link
            className="mb-4 block text-3xl font-bold text-primary hover:underline"
            href="/get-involved/leader"
          >
            Apply to be a Leader
          </Link>
          <p className="max-w-[800px] leading-loose text-body-color">
            We are constantly accepting leadership requests. We will reach out
            within 1-2 business days. If you do not hear back after 1-2 weeks,
            please contact our Executive Team via Instagram.
          </p>
        </div>
      </section>
      <section id="start-up-competition">
        <div className="container py-6 md:py-8 lg:py-10">
          <Link
            className="mb-4 block text-3xl font-bold text-body-color hover:cursor-not-allowed"
            href="#"
          >
            Start-Up Competition
          </Link>
          <p className="max-w-[800px] leading-loose text-body-color">
            The 2024-2025 Start-Up Competition will be announced in the Fall of
            2024. Stay tuned!
          </p>
        </div>
      </section>
      <section id="ffi-schoolar">
        <div className="container py-6 md:py-8 lg:py-10">
          <Link
            className="mb-4 block text-3xl font-bold text-body-color hover:cursor-not-allowed"
            href="#"
          >
            Apply to be an FFI Scholar
          </Link>
          <p className="max-w-[800px] leading-loose text-body-color">
            The 2024-2025 scholarship application will be announced in the Fall
            of 2024. Stay tuned!
          </p>
        </div>
      </section>
    </>
  );
};

export default GetInvolvedPage;
