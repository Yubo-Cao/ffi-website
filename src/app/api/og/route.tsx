/* eslint-disable */
import { BASE_URL, LOGO } from "@/lib/constants";
import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div tw="flex gap-2 items-center justify-center w-full h-full bg-white">
        <div tw="flex size-48">
          <img src={`${BASE_URL}/${LOGO}`} tw="max-w-40" alt="Logo" />
        </div>
        <div tw="flex flex-col gap-1">
          <h1 tw="text-2xl font-bold text-gray-900">Future Finance Inc.</h1>
          <p tw="text-lg text-gray-700">
            Organization providing free, accessible financial education to all.
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
