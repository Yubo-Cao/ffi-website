import { clientConfig, serverConfig } from "./config";
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";

export async function getToken() {
  return await getTokens(await cookies(), {
    apiKey: clientConfig.apiKey,
    cookieName: serverConfig.cookieName,
    cookieSignatureKeys: serverConfig.cookieSignatureKeys,
    serviceAccount: serverConfig.serviceAccount,
  });
}
