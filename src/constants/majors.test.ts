import { describe, expect, it } from "vitest";
import { getResourceMajorLabels } from "./majors";

describe("getResourceMajorLabels", () => {
  it("returns every major as a display name", () => {
    expect(
      getResourceMajorLabels({ majors: ["DATA_SCIENCE", "COMPUTER_SCIENCE_AND_STATISTIC"], major: "DATA_SCIENCE" }),
    ).toEqual(["Data Science", "Computer Science & Statistics"]);
  });

  it("falls back to the legacy single major", () => {
    expect(getResourceMajorLabels({ majors: [], major: "CYBER_SECURITY" })).toEqual(["Cyber Security"]);
    expect(getResourceMajorLabels({ majors: [] })).toEqual([]);
  });
});
