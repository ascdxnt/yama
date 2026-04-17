const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || 'mock';
const SANITY_DATASET = process.env.SANITY_DATASET || 'production';
const SANITY_API_VERSION = '2026-04-01';

interface SanityClientConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  useCdn: boolean;
  token?: string;
}

export const sanityConfig: SanityClientConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
};

export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T> {
  const url = new URL(`https://${sanityConfig.projectId}.api.sanity.io/v${sanityConfig.apiVersion}/data/query/${sanityConfig.dataset}`);
  url.searchParams.set('query', query);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    });
  }

  const headers: Record<string, string> = {};
  if (sanityConfig.token) {
    headers.Authorization = `Bearer ${sanityConfig.token}`;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Sanity fetch failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.result as T;
}
