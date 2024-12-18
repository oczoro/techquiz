import { NextResponse } from "next/server";

export const GET = async () => {
  const response = await fetch("https://quizapi.io/api/v1/tags", {
    cache: "force-cache",
    next: {
      revalidate: 86400, // 24 hours
    },
    method: "GET",
    headers: {
      "X-Api-Key": `${process.env.QUIZAPI_API_KEY}`,
    },
  });
  const data = await response.json();

  if (data.error)
    return NextResponse.json({ error: `${data.error}` }, { status: 500 });

  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
