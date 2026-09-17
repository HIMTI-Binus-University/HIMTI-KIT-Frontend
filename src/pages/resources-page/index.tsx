import { CatalogPage } from "@/components/ui/item-page";
import type { CatalogItem } from "@/components/ui/item-card";

const resources: CatalogItem[] = [
  {
    id: "data-structures",
    type: "resource",
    title: "Data Structures",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    majors: ["Computer Science", "Software Engineering"],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRGPTKk5gIT4WmHn09kAYA-wOjVmz-zlUfZw8OehN4kg&s=10",
    fileUrl: "https://example.com/data-structures.pdf",
  },
  {
    id: "basic-statistics",
    type: "resource",
    title: "Basic Statistics",
    description:
      "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    majors: ["Computer Science", "Data Science", "Computer Science & Statistics", "Artificial Intelligence",],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBKTKf_bz61_kBkUbw7PuvEyUMU6plxid_-WeWm5WAYQ&s",
    fileUrl: "https://example.com/data-structures.pdf",
  },
  {
    id: "linear-algebra",
    type: "resource",
    title: "Linear Algebra",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    majors: ["Computer Science", "Computer Science & Mathematics", "Data Science", "Artificial Intelligence",],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJb3lp6CG0fl-3y9ddIyDGfMy2hSRTOGH_rP0DGpTz_w&s=10",
    fileUrl: "https://example.com/data-structures.pdf",
  },
  {
    id: "discrete-mathematics",
    type: "resource",
    title: "Discrete Mathematics",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    majors: ["Computer Science", "Cyber Security", "Software Engineering", "Game Application and Technology",],
    coverImageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThGjf_pP9J0IVXzPfl4X2Fq-60VdKa4WG34eeBGkCllA&s=10",
    fileUrl: "https://example.com/data-structures.pdf",
  },
];

export default function ResourcesPage() {
  return (
    <CatalogPage
      title="Notes"
      description="Find your subject notes in PDF form. All materials are available to view or download."
      items={resources}
    />
  );
}