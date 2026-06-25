import type { Locale } from '~/lib/i18n';
// import { getDictionary } from '~/lib/l10n';
import LanguageSwitch from './language-switch';

export default async function Navigation({ locale }: { locale: Locale }) {
  // const d = await getDictionary(locale);

  return (
    <nav className="fixed flex w-dvw border border-blue-500 border-solid">
      <div>{locale === 'es' ? 'HOLA' : 'HELLO'}</div>
      <LanguageSwitch />
    </nav>
  );
}
