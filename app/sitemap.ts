import { projects } from '@/lib/data/projects';
import { SITE_URL } from '@/lib/site';

export default async function sitemap() {
  const baseUrl = SITE_URL;

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
  }));

  const staticUrls = ['', '/about', '/projects', '/recognition', '/certifications', '/contact', '/colophon'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...projectUrls];
}
