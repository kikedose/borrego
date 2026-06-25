import Navigation from '~/components/layout/navigation';
import ScrollProgress from '~/components/layout/scroll-progress';

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; id?: string }>;
}) {
  const { locale } = await params;
  const safeLocale = locale as 'en' | 'es';

  return (
    <>
      <ScrollProgress />
      <Navigation locale={safeLocale} />
      <main className="w-full">{children}</main>
      {/* <Footer /> */}
    </>
  );
}
