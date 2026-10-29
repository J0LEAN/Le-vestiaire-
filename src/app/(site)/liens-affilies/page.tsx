import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Liens affiliés", alternates: { canonical: "/liens-affilies" } };

// Information des visiteurs sur l'affiliation (transparence commerciale).
export default function LiensAffilies() {
  return (
    <LegalPage title="Liens affiliés" updated={new Date().toLocaleDateString("fr-FR")}>
      <p>
        Pour financer le site, certains liens vers les articles sont des <strong>liens affiliés</strong>. Ils sont
        signalés par la mention « Lien affilié » à côté du bouton « Voir l&apos;article ».
      </p>

      <h2>Comment ça fonctionne ?</h2>
      <p>
        Si vous achetez un article après avoir cliqué sur un lien affilié, la boutique reverse une petite commission à{" "}
        {SITE.name}. <strong>Le prix que vous payez reste exactement le même.</strong>
      </p>

      <h2>Notre engagement</h2>
      <p>
        Les tenues sont composées pour leur cohérence et leur style, pas en fonction des commissions. Un article affilié
        n&apos;est jamais mis en avant parce qu&apos;il rapporte davantage, et de nombreux articles ne sont pas affiliés du
        tout.
      </p>

      <h2>Programmes d&apos;affiliation utilisés</h2>
      <p>
        <Todo>liste de vos programmes, par ex. Awin, Effiliation, Amazon Partenaires…</Todo>
      </p>
      <p className="text-sm text-muted">
        Si vous rejoignez Amazon Partenaires, ajoutez la phrase obligatoire : « En tant que Partenaire Amazon, je réalise un
        bénéfice sur les achats remplissant les conditions requises. »
      </p>
    </LegalPage>
  );
}
