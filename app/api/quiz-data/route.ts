import { NextResponse } from "next/server";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const params = url.searchParams;
  const response = await fetch(
    `https://quizapi.io/api/v1/questions?${params}`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": `${process.env.QUIZAPI_API_KEY}`,
      },
    },
  );
  const data = await response.json();

  if (data.error === 404)
    return NextResponse.json({ error: "No questions found" }, { status: 404 });
  if (data.error === 429)
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
