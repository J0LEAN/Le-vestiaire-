import type { Metadata } from "next";
import { LegalPage, Todo } from "@/components/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

// Modèle de politique de confidentialité (RGPD).
export default function Confidentialite() {
  return (
    <LegalPage title="Politique de confidentialité" updated={new Date().toLocaleDateString("fr-FR")}>
      <p>
        {SITE.name} respecte votre vie privée. Cette page explique quelles données sont collectées, pourquoi, et quels sont
        vos droits.
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <Todo>votre nom ou celui de votre entreprise</Todo>, joignable à <Todo>adresse email de contact</Todo>.
      </p>

      <h2>Données collectées</h2>
      <ul>
        <li>
          <strong>Newsletter</strong> : si vous vous inscrivez, nous enregistrons votre adresse email et la date
          d&apos;inscription. Elles servent uniquement à vous envoyer la newsletter du site. Base légale : votre
          consentement.
        </li>
        <li>
          <strong>Navigation</strong> : le site n&apos;utilise ni outil de mesure d&apos;audience, ni publicité ciblée, ni
          cookie de suivi. <Todo>à mettre à jour si vous ajoutez un outil de statistiques</Todo>
        </li>
      </ul>

      <h2>Durée de conservation</h2>
      <p>
        Votre adresse email est conservée jusqu&apos;à votre désinscription, ou au plus 3 ans après notre dernier contact
        avec vous.
      </p>

      <h2>Destinataires</h2>
      <p>
        Vos données ne sont ni vendues ni louées. Elles sont stockées chez notre hébergeur (Railway) et, si nous en
        utilisons un, chez notre outil d&apos;envoi d&apos;emails : <Todo>nom de l&apos;outil, par ex. Brevo</Todo>.
      </p>

      <h2>Cookies</h2>
      <p>
        Le site ne dépose aucun cookie sur les visiteurs. Un cookie strictement technique est utilisé uniquement pour
        l&apos;espace d&apos;administration. Les polices de caractères sont hébergées sur le site lui-même : aucune
        donnée n&apos;est envoyée à Google.
      </p>

      <h2>Liens vers les boutiques</h2>
      <p>
        Lorsque vous cliquez sur un article, vous quittez {SITE.name} pour le site de la boutique, qui applique sa propre
        politique de confidentialité et peut déposer ses propres cookies (notamment pour les liens affiliés).
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment accéder à vos données, les rectifier, les supprimer ou vous opposer à leur utilisation, en
        écrivant à <Todo>adresse email de contact</Todo>. Chaque newsletter contient aussi un lien de désinscription. En
        cas de difficulté, vous pouvez saisir la CNIL (<a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).
      </p>
    </LegalPage>
  );
}
