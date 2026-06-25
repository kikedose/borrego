import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names or conditional class names into a single string,
 * merging and deduplicating Tailwind classes using twMerge.
 *
 * @param inputs - Class names to be combined. Can include strings,
 *                                   objects with class names as keys and booleans as values,
 *                                   or arrays of class names.
 * @returns A string of combined and deduplicated class names.
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

/**
 * Parses the Accept-Language header string and returns a sorted list
 * of language tags based on their quality values (q-factor).
 *
 * @param {string | null | undefined} headerValue The value of the Accept-Language header.
 * @returns {string[]} A sorted array of language tags, highest preference first.
 */
export const parseAcceptLanguage = (
  headerValue: string | null | undefined,
): string[] => {
  if (!headerValue) {
    return [];
  }

  interface LanguagePreference {
    tag: string;
    quality: number;
  }

  const languages: LanguagePreference[] = headerValue
    .split(",")
    .map((langEntry): LanguagePreference | null => {
      // Map potentially to null for invalid entries if needed (though currently filtering implicitly)
      const parts = langEntry.trim().split(";q=");
      const tag = parts[0]?.trim(); // Use optional chaining for safety

      if (!tag) {
        return null;
      }

      // Default quality is 1 if not specified or parsing fails
      let quality = 1.0;
      if (parts[1]) {
        const parsedQuality = parseFloat(parts[1]);
        // Ensure quality is a valid number between 0 and 1
        quality =
          !isNaN(parsedQuality) && parsedQuality >= 0 && parsedQuality <= 1
            ? parsedQuality
            : 1.0;
      }
      return { tag, quality };
    })
    .filter((lang): lang is LanguagePreference => lang !== null);

  languages.sort((a, b) => b.quality - a.quality);

  return languages.map((lang) => lang.tag);
};

/**
 * Finds the best matching locale from the supported locales based on
 * the user's preferred languages.
 *
 * Implements a simple matching strategy:
 * 1. Check for an exact match.
 * 2. Check if the base language (e.g., 'en' from 'en-US') matches a supported locale's base language.
 * 3. Check if the base language itself is directly supported.
 *
 * @param {string[]} preferredLanguages Sorted list of preferred language tags (from parseAcceptLanguage).
 * @param {string[]} supportedLocales List of locales your application supports.
 * @param {string} defaultLocale The default locale to return if no match is found.
 * @returns {string} The best matching supported locale or the default locale.
 */
export function findBestLocaleMatch(
  preferredLanguages: readonly string[],
  supportedLocales: readonly string[],
  defaultLocale: string,
): string {
  const supportedLocalesSet = new Set<string>(supportedLocales);

  for (const preferredLang of preferredLanguages) {
    if (supportedLocalesSet.has(preferredLang)) {
      return preferredLang;
    }

    const basePreferredLang = preferredLang.split("-")[0]?.toLowerCase();

    if (basePreferredLang) {
      for (const supportedLocale of supportedLocales) {
        const baseSupportedLocale = supportedLocale
          .split("-")[0]
          ?.toLowerCase();
        if (basePreferredLang === baseSupportedLocale) {
          return supportedLocale;
        }
      }

      if (supportedLocalesSet.has(basePreferredLang)) {
        return basePreferredLang;
      }
    }
  }

  return defaultLocale;
}
