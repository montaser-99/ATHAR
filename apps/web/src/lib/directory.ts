import {
  PlatformDirectoryResponseSchema,
  PlatformDetailsResponseSchema,
  type PlatformDirectoryQuery,
} from '@athar/contracts';

const apiBase = process.env.ATHAR_API_URL ?? 'http://127.0.0.1:4000/api/v1';

function serializeQuery(query: PlatformDirectoryQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (Array.isArray(value))
      value.forEach((item) => params.append(key, String(item)));
    else params.set(key, String(value));
  }
  return params;
}

export async function getDirectory(query: PlatformDirectoryQuery) {
  const params = serializeQuery(query);
  const response = await fetch(`${apiBase}/platforms?${params}`, {
    cache: 'no-store',
  });
  if (!response.ok)
    throw new Error(`Directory API returned ${response.status}`);
  return PlatformDirectoryResponseSchema.parse(await response.json());
}

export async function getPlatform(slug: string) {
  const response = await fetch(
    `${apiBase}/platforms/${encodeURIComponent(slug)}`,
    { cache: 'no-store' },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Platform API returned ${response.status}`);
  return PlatformDetailsResponseSchema.parse(await response.json());
}
