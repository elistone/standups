import { createI18n } from 'vue-i18n';

// Base (eager) locale(s). Keep English inline for faster first paint.
import en from './locales/en.json';

// Detect initial locale
function detectLocale(): string {
    const available = availableLocales();
    const saved = localStorage.getItem('app.locale');
    if (saved) return saved;
    const nav = navigator.language || 'en';
    // Map e.g. 'en-GB' -> 'en'
    const short = nav.split('-')[0];
    return available.includes(short) ? short : 'en';
}

export function availableLocales(): string[] {
    return ['en', 'es', 'fr', 'de'];
}

export function localeIcon(locale: string): string {
    if (!availableLocales().includes(locale)) locale = 'en';
    if (locale === 'en') locale = 'gb'; // Use UK flag for English

    return `https://flagcdn.com/${locale}.svg`;
}

export const i18n = createI18n({
    legacy: false,
    locale: detectLocale(),
    fallbackLocale: 'en',
    messages: { en },
    globalInjection: true
});

// Lazy loader for additional locales
const loaded = new Set<string>(['en']);

export async function setLocale(locale: string) {
    if (i18n.global.locale.value === locale) return;
    if (!loaded.has(locale)) {
        try {
            const messages = await import(`./locales/${locale}.json`);
            i18n.global.setLocaleMessage(locale, messages.default);
            loaded.add(locale);
        } catch (e) {
            console.warn(`[i18n] Failed to load locale '${locale}', falling back to 'en'`, e);
            locale = 'en';
        }
    }
    i18n.global.locale.value = locale as any;
    document.documentElement.lang = locale;
    localStorage.setItem('app.locale', locale);
}