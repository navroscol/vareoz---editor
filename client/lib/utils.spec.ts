import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("combina clases", () => { expect(cn("a", "b")).toBe("a b"); });
  it("ignora falsy", () => { expect(cn("a", false && "x", "b")).toBe("a b"); });
});
