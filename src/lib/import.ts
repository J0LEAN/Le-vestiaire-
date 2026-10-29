// Lecture et vérification des fichiers d'import (JSON ou CSV).
// Ce fichier ne touche pas à la base de données : il transforme un texte en
// liste de tenues "propres", ou en liste d'erreurs compréhensibles.
// Le format est documenté dans IMPORT.md à la racine du projet.

import Papa from "papaparse";
import { CATEGORIES, OCCASIONS, SEASONS, STYLES, type Option } from "./constants";
import { slugify } from "./format";

export type ParsedItem = {
  name: string;
  category: string;
  brand: string | null;
  price: number | null;
  imageUrl: string | null;
  url: string;
  isAffiliate: boolean;
};

export type ParsedOutfit = {
  title: string;
  description: string;
  whyItWorks: string;
  style: string;
  occasion: string;
  season: string;
  budget: number | null;
  mainImage: string | null;
  featured: boolean;
  items: ParsedItem[];
};

export type ImportResult =
  | { ok: true; outfits: ParsedOutfit[] }
  | { ok: false; errors: string[] };

// Données "brutes" telles qu'écrites dans le fichier (avant vérification).
type Raw = Record<string, unknown>;

/** Point d'entrée : devine le format d'après le nom du fichier ou le contenu. */
export function parseImportFile(text: string, fileName = ""): ImportResult {
  const trimmed = text.replace(/^﻿/, "").trim(); // enlève l'éventuel BOM d'Excel
  if (!trimmed) return { ok: false, errors: ["Le fichier est vide."] };

  const looksLikeJson = fileName.toLowerCase().endsWith(".json") || /^[[{]/.test(trimmed);
  return looksLikeJson ? parseJson(trimmed) : parseCsv(trimmed);
}

// ---------------------------------------------------------------- JSON

function parseJson(text: string): ImportResult {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    const detail = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      errors: [
        `Le fichier JSON est mal formé (${detail}). Vérifie les virgules, les guillemets et les accolades. ` +
          `Astuce : colle le contenu sur https://jsonlint.com pour trouver la ligne fautive.`,
      ],
    };
  }
  // On accepte { "tenues": [...] } ou directement [...]
  const list = Array.isArray(data) ? data : (data as Raw)?.tenues;
  if (!Array.isArray(list)) {
    return { ok: false, errors: ['Le fichier doit contenir une liste "tenues" : { "tenues": [ ... ] }.'] };
  }
  return validateOutfits(list as Raw[]);
}

// ---------------------------------------------------------------- CSV

// Colonnes du CSV : une ligne par article. Les lignes qui ont le même
// "titre" forment une seule tenue (les infos de la tenue peuvent n'être
// écrites que sur la première ligne).
function parseCsv(text: string): ImportResult {
  const parsed = Papa.parse<Raw>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => slugify(h).replace(/-/g, "_"), // "Prix (€)" → "prix"
  });
  if (parsed.errors.length) {
    const errs = parsed.errors.slice(0, 5).map((e) => `CSV, ligne ${(e.row ?? 0) + 2} : ${e.message}`);
    return { ok: false, errors: errs };
  }
  const rows = parsed.data;
  if (!rows.length) return { ok: false, errors: ["Le CSV ne contient aucune ligne de données."] };
  if (!("titre" in rows[0])) {
    return { ok: false, errors: ['La colonne "titre" est introuvable dans la première ligne du CSV.'] };
  }

  // Regroupe les lignes par titre de tenue, dans l'ordre du fichier.
  const groups = new Map<string, Raw>();
  for (const row of rows) {
    const title = String(row.titre ?? "").trim();
    if (!title) continue;
    let outfit = groups.get(title);
    if (!outfit) {
      outfit = { titre: title, articles: [] as Raw[] };
      groups.set(title, outfit);
    }
    // Les champs de la tenue : on garde la première valeur non vide.
    for (const key of ["description", "pourquoi_ca_marche", "style", "occasion", "saison", "budget", "image_tenue", "a_la_une"]) {
      if (!outfit[key] && row[key]) outfit[key] = row[key];
    }
    if (outfit.image_tenue) outfit.image = outfit.image_tenue;
    (outfit.articles as Raw[]).push({
      nom: row.nom_article,
      categorie: row.categorie,
      marque: row.marque,
      prix: row.prix,
      image: row.image_article,
      lien: row.lien,
      affilie: row.affilie,
    });
  }
  return validateOutfits([...groups.values()]);
}

// ---------------------------------------------------------------- Vérification

function validateOutfits(list: Raw[]): ImportResult {
  const errors: string[] = [];
  const outfits: ParsedOutfit[] = [];

  if (!list.length) return { ok: false, errors: ["Le fichier ne contient aucune tenue."] };

  list.forEach((raw, index) => {
    const title = text(raw?.titre);
    const where = `Tenue n°${index + 1}${title ? ` « ${title} »` : ""}`;
    if (!raw || typeof raw !== "object") {
      errors.push(`${where} : ce n'est pas un objet { ... } valide.`);
      return;
    }
    const err = (msg: string) => errors.push(`${where} : ${msg}`);

    if (!title) err('le champ "titre" est obligatoire.');
    const description = text(raw.description);
    if (!description) err('le champ "description" est obligatoire.');
    const whyItWorks = text(raw.pourquoi_ca_marche);
    if (!whyItWorks) err('le champ "pourquoi_ca_marche" est obligatoire.');

    const style = choice(raw.style, STYLES, "style", err);
    const occasion = choice(raw.occasion, OCCASIONS, "occasion", err);
    const season = choice(raw.saison, SEASONS, "saison", err);

    let budget: number | null = null;
    if (text(raw.budget)) {
      budget = toNumber(raw.budget);
      if (budget == null) err(`le budget « ${text(raw.budget)} » n'est pas un nombre.`);
      else budget = Math.round(budget);
    }

    const mainImage = text(raw.image) || null;
    if (mainImage && !isUrl(mainImage)) err(`l'image « ${mainImage} » n'est pas une adresse valide (elle doit commencer par https://).`);

    const rawItems = raw.articles;
    const items: ParsedItem[] = [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      err('il faut au moins un article dans "articles".');
    } else {
      rawItems.forEach((ri: Raw, j: number) => {
        const iname = text(ri?.nom);
        const iwhere = `article n°${j + 1}${iname ? ` « ${iname} »` : ""}`;
        const ierr = (msg: string) => err(`${iwhere} : ${msg}`);
        if (!iname) ierr('le champ "nom" est obligatoire.');
        const category = choice(ri?.categorie, CATEGORIES, "categorie", ierr);
        const url = text(ri?.lien);
        if (!url) ierr('le champ "lien" est obligatoire.');
        else if (!isUrl(url)) ierr(`le lien « ${url} » n'est pas une adresse valide (il doit commencer par https://).`);
        let price: number | null = null;
        if (text(ri?.prix)) {
          price = toNumber(ri.prix);
          if (price == null) ierr(`le prix « ${text(ri.prix)} » n'est pas un nombre.`);
        }
        const imageUrl = text(ri?.image) || null;
        if (imageUrl && !isUrl(imageUrl)) ierr(`l'image « ${imageUrl} » n'est pas une adresse valide.`);
        items.push({
          name: iname,
          category,
          brand: text(ri?.marque) || null,
          price,
          imageUrl,
          url,
          isAffiliate: toBool(ri?.affilie),
        });
      });
    }

    outfits.push({
      title,
      description,
      whyItWorks,
      style,
      occasion,
      season,
      budget,
      mainImage,
      featured: toBool(raw.a_la_une),
      items,
    });
  });

  return errors.length ? { ok: false, errors } : { ok: true, outfits };
}

// ---------------------------------------------------------------- Petits outils

function text(v: unknown): string {
  if (v == null) return "";
  return String(v).trim();
}

/** Accepte la valeur ("soiree") ou le libellé ("Soirée"), sans tenir compte des accents/majuscules. */
function choice(v: unknown, options: Option[], field: string, err: (m: string) => void): string {
  const raw = text(v);
  if (!raw) {
    err(`le champ "${field}" est obligatoire.`);
    return "";
  }
  const key = slugify(raw);
  const found = options.find((o) => o.value === key || slugify(o.label) === key);
  if (!found) {
    err(`« ${raw} » n'est pas une valeur autorisée pour "${field}". Valeurs possibles : ${options.map((o) => o.value).join(", ")}.`);
    return "";
  }
  return found.value;
}

/** "49,90 €" → 49.9 */
function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  const cleaned = text(v).replace(/[€\s ]/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** true, "oui", "1", "x"… → true */
function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  return ["true", "oui", "1", "x", "yes", "vrai"].includes(text(v).toLowerCase());
}

/** Adresse web (https://…) ou image du site ("/exemples/…"). */
function isUrl(v: string): boolean {
  if (v.startsWith("/")) return true;
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}
