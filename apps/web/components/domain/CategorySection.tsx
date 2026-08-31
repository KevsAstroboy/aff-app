import { CategoryCard } from "./CategoryCard";

type CategorySectionProps = {
  eyebrow: string;
  categories: { id: string; name: string }[];
};

export function CategorySection({ eyebrow, categories }: CategorySectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-eyebrow uppercase tracking-[0.2em] text-text-muted">{eyebrow}</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {categories.map((c) => (
          <CategoryCard key={c.id} id={c.id} title={c.name} />
        ))}
      </div>
    </section>
  );
}
