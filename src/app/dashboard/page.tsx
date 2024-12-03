import Breadcrumb from "@/components/Common/Breadcrumb";
import EnrolledCourses from "@/components/Dashboard/enrolled-courses";
import { CoursesSkeleton } from "@/components/Dashboard/loading";
import { clientConfig, serverConfig } from "@/lib/config";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: `Dashboard | ${NAME}`,
  description: "Learn about financial literacy and entrepreneurship.",
};

const DashboardPage = async () => {
  const tokens = await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });

  if (!tokens) {
    redirect("/login");
  }

  return (
    <>
      <Breadcrumb
        pageName="Dashboard"
        description="Learn about financial literacy and entrepreneurship."
      />
      <main className="container mb-8">
        <Suspense fallback={<CoursesSkeleton />}>
          <EnrolledCourses />
        </Suspense>
      </main>
    </>
  );
};

export default DashboardPage;
