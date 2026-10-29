// Remplit la base avec les 6 tenues d'exemple (fichier donnees-exemple.json).
// Lancement : npm run db:seed
// Par sécurité, ne fait rien si la base contient déjà des tenues,
// sauf avec l'option --force (qui EFFACE toutes les tenues existantes).

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@prisma/client";
import { parseImportFile } from "../src/lib/import";
import { createOutfits } from "../src/lib/outfits";

const db = new PrismaClient();

async function main() {
  const force = process.argv.includes("--force");
  const count = await db.outfit.count();
  if (count > 0 && !force) {
    console.log(`La base contient déjà ${count} tenue(s) : rien n'a été ajouté.`);
    console.log("Pour tout effacer et recharger les exemples : npm run db:seed -- --force");
    return;
  }
  if (force) await db.outfit.deleteMany();

  const file = join(__dirname, "donnees-exemple.json");
  const result = parseImportFile(readFileSync(file, "utf8"), file);
  if (!result.ok) {
    console.error("Le fichier d'exemple contient des erreurs :\n- " + result.errors.join("\n- "));
    process.exit(1);
  }
  const created = await createOutfits(db, result.outfits, "publiee");
  console.log(`${created} tenues d'exemple ajoutées et publiées.`);
}

main().finally(() => db.$disconnect());
