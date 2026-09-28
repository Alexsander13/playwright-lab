export function getSafeInternalPath(candidate: string | null, origin: string) {
  if (!candidate) {
    return "/";
  }

  try {
    const target = new URL(candidate, origin);

    if (target.origin !== origin) {
      return "/";
    }

    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/";
  }
}