// Mémoire de « Mon portant » (tenues mises de côté), gardée dans le navigateur.
// Pas encore de comptes : on utilise localStorage. Quand les comptes arriveront,
// il suffira de remplacer ce fichier par des appels au serveur (table Prisma).

const KEY = "vestiaire:portant";
const EMPTY: string[] = [];

let raw: string | null = null; // dernière valeur lue (texte JSON)
let cache: string[] = EMPTY; // liste des slugs, même objet tant que rien ne change
let memory: string | null = null; // secours si localStorage est indisponible
const listeners = new Set<() => void>();

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return memory;
  }
}

/** Liste des tenues (slugs) mises de côté. */
export function getSaved(): string[] {
  const next = readRaw();
  if (next !== raw) {
    raw = next;
    try {
      const parsed = JSON.parse(next ?? "[]");
      cache = Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : EMPTY;
    } catch {
      cache = EMPTY;
    }
  }
  return cache;
}

/** Côté serveur, le portant est toujours vide (le navigateur le remplit ensuite). */
export function getServerSaved(): string[] {
  return EMPTY;
}

export function setSaved(list: string[]) {
  const text = JSON.stringify(list);
  try {
    window.localStorage.setItem(KEY, text);
  } catch {
    memory = text;
  }
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  // Synchronise les autres onglets ouverts
  const onStorage = (e: StorageEvent) => e.key === KEY && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
