import { useQuery } from "@tanstack/react-query";
import { getSoftware } from "@/api/himti-kit";
import { CatalogPage } from "@/components/ui/item-page";
import type { CatalogItem } from "@/components/ui/item-card";

export default function SoftwaresPage() {
  const {
    data: softwares = [],
    isPending,
    isError,
  } = useQuery({
    queryKey: ["himti-kit", "softwares"],
    queryFn: getSoftware,
  });

  const items: CatalogItem[] = softwares.map((software) => ({
    id: software.id,
    type: "software",
    title: software.name,
    description: software.description ?? "No description available.",
    majors: [],
    coverImageUrl: software.coverImageUrl ?? undefined,
    fileUrl: software.downloadUrl,
  }));

  if (isPending) {
    return <p className="p-8 text-center">Loading applications...</p>;
  }

  if (isError) {
    return (
      <p className="p-8 text-center">
        Could not load applications. Please try again later.
      </p>
    );
  }

  return (
    <CatalogPage
      title="Applications"
      description="Find recommended software and development tools for your studies."
      items={items}
    />
  );
}