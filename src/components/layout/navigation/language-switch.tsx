'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { setLocaleCookie } from '~/lib/actions';

export default function LanguageSwitch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const triggerLocaleSwitch = async () => {
    const { locale = 'es' } = params as { locale?: string };
    const nextLocale = locale === 'es' ? 'en' : 'es';
    const href = pathname.replace(locale, nextLocale);

    await setLocaleCookie(nextLocale);
    router.replace(href, { scroll: false });
  };

  return (
    <button
      type="button"
      className="border border-solid border-green-500 cursor-pointer hover:underline hover:decoration-dotted"
      onClick={triggerLocaleSwitch}
    >
      [ {params.locale} ]
    </button>
  );
}
