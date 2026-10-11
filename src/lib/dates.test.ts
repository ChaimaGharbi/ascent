import { describe, expect, it } from "vitest";
import { addDays, toISO } from "./dates";

describe("dates", () => {
  it("formats a local date as ISO", () => {
    expect(toISO(new Date(2026, 9, 7))).toBe("2026-10-07");
  });
  it("adds days across a month boundary", () => {
    expect(addDays("2026-10-30", 3)).toBe("2026-11-02");
  });
});
