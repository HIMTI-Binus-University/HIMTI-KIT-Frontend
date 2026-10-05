import { useQuery } from "@tanstack/react-query";
import { getResources } from "@/api/himti-kit";
import { CatalogPage } from "@/components/ui/item-page";
import type { CatalogItem } from "@/components/ui/item-card";

export default function ResourcesPage() {
  const {
    data: resources = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["himti-kit", "resources"],
    queryFn: getResources,
  });

  const items: CatalogItem[] = resources.map((resource) => ({
    id: resource.id,
    type: "resource",
    title: resource.title,
    description: resource.description ?? "No description available.",
    majors: [resource.major],
    coverImageUrl: resource.coverImageUrl ?? undefined,
    fileUrl: resource.downloadUrl,
  }));

  if (isPending) {
    return <p className="p-8 text-center">Loading notes...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center">
        Could not load notes. Please try again later.
      </p>
    );
  }

  return (
    <CatalogPage
      title="Notes"
      description="Find your subject notes in PDF form. All materials are available to download."
      items={items}
    />
  );
}