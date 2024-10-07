import Breadcrumb from "@/components/Common/Breadcrumb";
import EnrolledCourses from "@/components/Dashboard/EnrolledCourses";
import { clientConfig, serverConfig } from "@/lib/config";
import { NAME } from "@/lib/constants";
import { Metadata } from "next";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `Dashboard | ${NAME}`,
  description: "Learn about financial literacy and entrepreneurship.",
};

const DashboardPage = async () => {
  const tokens = await getTokens(cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
  if (!tokens) {
    return notFound();
  }
  return (
    <>
      <Breadcrumb
        pageName="Dashboard"
        description="Learn about financial literacy and entrepreneurship."
      />
      <EnrolledCourses />
    </>
  );
};

export default DashboardPage;
