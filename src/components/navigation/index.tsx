import type { Locale } from "~/lib/i18n";
// import { getDictionary } from '~/lib/l10n';
import LanguageSwitch from "./language-switch";

export default async function Navigation({ locale }: { locale: Locale }) {
  // const d = await getDictionary(locale);

  return (
    <nav className="w-dvw flex border border-blue-500 border-solid fixed">
      <div>{locale === "es" ? "HOLA" : "HELLO"}</div>
      <LanguageSwitch />
    </nav>
  );
}
