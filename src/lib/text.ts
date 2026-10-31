// Petits outils de mise en forme des textes éditoriaux.

/** Sépare un titre en [début, dernier mot] pour mettre le dernier mot en italique cerise. */
export function splitLastWord(title: string): [string, string] {
  const i = title.trimEnd().lastIndexOf(" ");
  return i === -1 ? ["", title] : [title.slice(0, i + 1), title.slice(i + 1)];
}

/** Sépare un texte en [première phrase, suite]. */
export function splitFirstSentence(text: string): [string, string] {
  const m = text.match(/^([\s\S]+?[.!?…])\s+([\s\S]*)$/);
  return m ? [m[1], m[2]] : [text, ""];
}
