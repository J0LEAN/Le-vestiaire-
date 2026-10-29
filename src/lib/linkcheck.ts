// Vérification des liens d'achat : on "visite" chaque adresse et on note le résultat.

export type LinkResult = { status: "ok" | "casse" | "erreur"; error: string | null };

const HEADERS = {
  // On se présente comme un navigateur : beaucoup de boutiques bloquent les robots.
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,*/*",
  "Accept-Language": "fr-FR,fr;q=0.9",
};

async function request(url: string, method: "HEAD" | "GET"): Promise<Response> {
  const res = await fetch(url, { method, headers: HEADERS, redirect: "follow", signal: AbortSignal.timeout(10_000) });
  if (method === "GET") res.body?.cancel().catch(() => {}); // inutile de télécharger la page
  return res;
}

/** Teste une adresse. */
export async function checkUrl(url: string): Promise<LinkResult> {
  if (url.startsWith("/")) return { status: "ok", error: null }; // page du site lui-même
  try {
    let res = await request(url, "HEAD");
    // Certains sites refusent HEAD : on réessaie avec une vraie visite (GET).
    if (res.status >= 400) res = await request(url, "GET");

    if (res.ok) return { status: "ok", error: null };
    if (res.status === 404 || res.status === 410) {
      return { status: "casse", error: `Page introuvable (erreur ${res.status}) : le produit a sans doute été retiré.` };
    }
    if (res.status === 403 || res.status === 429 || res.status === 401) {
      return { status: "erreur", error: `Le site a refusé la vérification automatique (erreur ${res.status}) : vérifiez le lien à la main.` };
    }
    return { status: "erreur", error: `Le site a répondu par une erreur ${res.status} : à vérifier à la main.` };
  } catch (e) {
    const code = (e as { cause?: { code?: string } })?.cause?.code;
    if (code === "ENOTFOUND") return { status: "casse", error: "Site introuvable : l'adresse est peut-être mal écrite." };
    if (e instanceof Error && e.name === "TimeoutError") {
      return { status: "erreur", error: "Le site n'a pas répondu à temps (10 s) : à vérifier à la main." };
    }
    return { status: "erreur", error: "Impossible de joindre le site : à vérifier à la main." };
  }
}

/** Exécute `fn` sur chaque élément, `limit` à la fois (pour ne pas surcharger les sites). */
export async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      results[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
