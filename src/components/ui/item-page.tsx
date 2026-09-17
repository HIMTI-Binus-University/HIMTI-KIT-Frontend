import { useState } from "react";
import { Search } from "lucide-react";
import { CatalogCard, type CatalogItem } from "@/components/ui/item-card";
import { KitHeader } from "@/components/layout/kit-header";

type CatalogPageProps = {
  title: string;
  description: string;
  items: CatalogItem[];
};

export function CatalogPage({
  title,
  description,
  items,
}: CatalogPageProps) {
  const [search, setSearch] = useState("");

  const filteredItems = items.filter((item) =>
  `${item.title} ${item.majors.join(" ")}`
    .toLowerCase()
    .includes(search.trim().toLowerCase()),
  ); 

  return (
    <main className="min-h-screen bg-slate-950">
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/login-background.jpg')" }}
      >
        <div className="min-h-screen bg-slate-950/55">
          <KitHeader />

          <section className="mx-auto max-w-6xl px-5 py-10">
            <div className="rounded-[2rem] bg-white/95 p-6 shadow-2xl sm:p-12">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                {title}
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">{description}</p>

              <div className="my-7 h-px bg-slate-300" />

              <label className="relative block max-w-md">
                <span className="sr-only">Search {title}</span>

                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={`Search ${title.toLowerCase()}...`}
                  className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm outline-none transition focus:border-slate-900"
                />
              </label>

              {filteredItems.length ? (
                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredItems.map((item) => (
                    <CatalogCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-slate-600">No items match your search.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}