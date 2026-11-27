/**
 * The site's public address, in one place. Used for canonical URLs, the
 * sitemap, robots, Open Graph and the JSON-LD Person record.
 *
 * Resolution order:
 *  1. NEXT_PUBLIC_SITE_URL: set this in Vercel once a custom domain exists
 *     (e.g. https://tousifali.com), or any time you want to pin it.
 *  2. VERCEL_PROJECT_PRODUCTION_URL: provided by Vercel on every deployment.
 *     It is the production domain (a custom domain automatically, once one is
 *     added), so preview builds still point search engines at production.
 *  3. The current production deployment, as a last resort.
 *
 * No redirect is needed: the site simply describes itself wherever it lives.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'https://portfolio-tousif-ali.vercel.app';
}

export const SITE_URL = resolveSiteUrl();

/** Bare host for display, e.g. on share images. */
export const SITE_HOST = SITE_URL.replace(/^https?:\/\//, '');
