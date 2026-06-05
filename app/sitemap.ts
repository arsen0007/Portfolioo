import { projects } from '@/lib/data/projects';

export default async function sitemap() {
  const baseUrl = 'https://tousifali.com';

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
  }));

  const staticUrls = ['', '/about', '/recognition', '/contact', '/architecture'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticUrls, ...projectUrls];
}
