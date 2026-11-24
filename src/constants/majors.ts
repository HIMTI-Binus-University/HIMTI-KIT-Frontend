import type { KitResource } from "@/types/himti-kit";

export const MAJOR_LABELS: Record<string, string> = {
  COMPUTER_SCIENCE: "Computer Science",
  MOBILE_APPLICATION_AND_TECHNOLOGY: "Mobile Application and Technology",
  GAME_APPLICATION_AND_TECHNOLOGY: "Game Application and Technology",
  DATA_SCIENCE: "Data Science",
  CYBER_SECURITY: "Cyber Security",
  COMPUTER_SCIENCE_AND_MATHEMATICS: "Computer Science & Mathematics",
  COMPUTER_SCIENCE_AND_STATISTIC: "Computer Science & Statistics",
  COMPUTER_SCIENCE_SOFTWARE_ENGINEERING: "Computer Science - Software Engineering",
  ARTIFICIAL_INTELLIGENCE: "Artificial Intelligence",
  DIGITAL_PSYCHOLOGY: "Digital Psychology",
};

export const ALL_MAJORS_COUNT = Object.keys(MAJOR_LABELS).length;

/** Display names for every major of a resource; falls back to the legacy single `major`. */
export const getResourceMajorLabels = (
  resource: Pick<KitResource, "majors" | "major">,
): string[] => {
  const raw = resource.majors?.length ? resource.majors : resource.major ? [resource.major] : [];
  return Array.from(new Set(raw.map((major) => MAJOR_LABELS[major] ?? major)));
};
