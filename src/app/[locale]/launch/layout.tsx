import { redirect } from "next/navigation";

const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br";

export default async function LaunchLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`${PORTAL_URL}/${locale}`);
}
