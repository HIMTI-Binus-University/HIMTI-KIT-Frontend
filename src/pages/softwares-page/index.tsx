import { CatalogPage } from "@/components/ui/item-page";
import type { CatalogItem } from "@/components/ui/item-card";

const softwares: CatalogItem[] = [
  {
    id: "visual-studio-code",
    title: "Visual Studio Code",
    fileUrl: "https://code.visualstudio.com/",
    majors: [
    "Computer Science",
    "Mobile Application and Technology",
    "Game Application and Technology",
    "Data Science",
    "Cyber Security",
    "Computer Science & Mathematics",
    "Computer Science & Statistics",
    "Software Engineering",
    "Artificial Intelligence",
    "Digital Psychology",
    ],
  },
  {
    id: "git",
    title: "Git",
    fileUrl: "https://git-scm.com/downloads",
    majors: [
    "Computer Science",
    "Mobile Application and Technology",
    "Game Application and Technology",
    "Data Science",
    "Cyber Security",
    "Computer Science & Mathematics",
    "Computer Science & Statistics",
    "Software Engineering",
    "Artificial Intelligence",
    "Digital Psychology",
    ],
  },
  {
    id: "postgresql",
    title: "PostgreSQL",
    fileUrl: "https://www.postgresql.org/download/",
    majors: [
    "Computer Science",
    "Mobile Application and Technology",
    "Game Application and Technology",
    "Data Science",
    "Cyber Security",
    "Computer Science & Mathematics",
    "Computer Science & Statistics",
    "Software Engineering",
    "Artificial Intelligence",
    "Digital Psychology",
    ],
  },
];

export default function SoftwaresPage() {
  return (
    <CatalogPage
      title="Applications"
      description="Find recommended software and development tools for your studies."
      items={softwares}
    />
  );
}