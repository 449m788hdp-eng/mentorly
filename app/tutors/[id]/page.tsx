import { PlatformScreen } from '@/components/platform';
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const [{ id }, p] = await Promise.all([params, searchParams]);
  return (
    <PlatformScreen
      screen="tutors"
      id={id}
      initialContact={p.contact === '1'}
    />
  );
}
