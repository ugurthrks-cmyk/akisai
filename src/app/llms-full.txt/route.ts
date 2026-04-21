import { buildLlmsFullTxt } from "@/lib/llms";

export const revalidate = 300;

export async function GET() {
  const body = await buildLlmsFullTxt();

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
    },
  });
}
