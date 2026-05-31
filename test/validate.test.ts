import { describe, it, expect } from "vitest";
import { isValidIpId } from "../src/lib/validate";

describe("isValidIpId", () => {
  it("accepts a 0x-prefixed 20-byte address", () => {
    expect(isValidIpId("0x" + "a".repeat(40))).toBe(true);
  });
  it("rejects wrong length / prefix / chars", () => {
    expect(isValidIpId("0x123")).toBe(false);
    expect(isValidIpId("nope")).toBe(false);
    expect(isValidIpId("0x" + "g".repeat(40))).toBe(false);
  });
});
