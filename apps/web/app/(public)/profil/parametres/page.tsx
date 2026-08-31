import { Save } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block text-eyebrow uppercase tracking-[0.18em] text-text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ParametresPage() {
  return (
    <div className="space-y-8">
      <Breadcrumb
        items={[
          { label: "Profil", href: "/profil" },
          { label: "Paramètres" },
        ]}
      />
      <PageHeader
        eyebrow="Mon compte"
        title="Paramètres"
        subtitle="Gérer vos informations et préférences."
      />

      <Card className="space-y-5">
        <h2 className="text-h2 font-bold text-text">Profil</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nom complet">
            <Input defaultValue="Jean Dupont" />
          </Field>
          <Field label="Email">
            <Input type="email" defaultValue="jean.dupont@email.com" />
          </Field>
          <Field label="Ville">
            <Input defaultValue="Paris" />
          </Field>
          <Field label="Pays">
            <Input defaultValue="France" />
          </Field>
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-h2 font-bold text-text">Notifications</h2>
        <div className="space-y-3">
          {[
            { label: "Nouvelles publications de mon réseau", defaultChecked: true },
            { label: "Rappels de sessions favorites", defaultChecked: true },
            { label: "Annonces du festival", defaultChecked: true },
            { label: "Newsletter hebdomadaire", defaultChecked: false },
          ].map((p) => (
            <label key={p.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={p.defaultChecked}
                className="h-4 w-4 accent-gold"
              />
              <span className="text-body text-text">{p.label}</span>
            </label>
          ))}
        </div>
      </Card>

      <Card className="space-y-5">
        <h2 className="text-h2 font-bold text-text">Sécurité</h2>
        <Field label="Mot de passe actuel">
          <Input type="password" placeholder="••••••••" />
        </Field>
        <Field label="Nouveau mot de passe">
          <Input type="password" placeholder="••••••••" />
        </Field>
      </Card>

      <div className="flex justify-end">
        <Button size="lg">
          <Save className="h-4 w-4" />
          Enregistrer les modifications
        </Button>
      </div>
    </div>
  );
}
