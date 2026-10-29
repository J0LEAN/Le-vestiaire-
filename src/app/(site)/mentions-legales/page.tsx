import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

// Modèle de mentions légales (loi pour la confiance dans l'économie numérique, art. 6).
export default function MentionsLegales() {
  return (
    <LegalPage title="Mentions légales" updated={new Date().toLocaleDateString("fr-FR")}>
      <h2>Éditeur du site</h2>
      <p>
        Le site {SITE.name} ({SITE.url}) est édité par : <Todo>votre nom et prénom, ou le nom de votre entreprise</Todo>
        <br />
        Statut : <Todo>particulier / micro-entreprise / société… et numéro SIRET le cas échéant</Todo>
        <br />
        Adresse : <Todo>adresse postale</Todo>
        <br />
        Email : <Todo>adresse email de contact</Todo>
      </p>
      <p>
        Directeur ou directrice de la publication : <Todo>votre nom</Todo>.
      </p>
      <p className="text-sm text-muted">
        Si vous éditez le site à titre non professionnel, vous pouvez ne publier que les coordonnées de votre hébergeur, à
        condition de lui avoir communiqué vos informations personnelles.
      </p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Railway Corporation, 548 Market St PMB 68956, San Francisco, CA 94104, États-Unis —{" "}
        <a href="https://railway.com" rel="noopener">railway.com</a>. <Todo>vérifier l&apos;adresse actuelle sur le site de Railway</Todo>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, la présentation et la sélection des tenues sont la propriété de l&apos;éditeur. Les photos de produits,
        noms et marques citées appartiennent à leurs propriétaires respectifs et ne sont utilisés que pour présenter et
        renvoyer vers les articles concernés. Pour toute demande de retrait, écrivez à l&apos;adresse de contact ci-dessus.
      </p>

      <h2>Responsabilité</h2>
      <p>
        Les prix et la disponibilité des articles sont donnés à titre indicatif et peuvent avoir changé sur les sites
        marchands. Les achats sont conclus directement avec les boutiques, selon leurs propres conditions de vente.
      </p>
    </LegalPage>
  );
}
