import { notFound } from "next/navigation";

type LegacyToolPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyToolPage({ params }: LegacyToolPageProps) {
  await params;
  notFound();
}
