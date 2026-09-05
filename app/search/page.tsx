import { PlatformScreen } from '@/components/platform';
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const p = await searchParams;
  return (
    <PlatformScreen
      screen="search"
      initialQuery={p.q}
      initialSubject={p.subject}
    />
  );
}
