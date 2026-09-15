import { describe, expect, it } from "vitest";
import { canTransitionAttempt, canTransitionJob, isTerminalAttempt } from "../src/job-state.js";

describe("job lifecycle", () => {
  it("allows deletion after a job becomes ready", () => {
    expect(canTransitionJob("READY", "DELETING")).toBe(true);
  });

  it("does not reuse job state to represent processing retries", () => {
    expect(canTransitionJob("READY", "DRAFT")).toBe(false);
  });
});

describe("processing attempts", () => {
  it("moves through the durable dispatch and execution path", () => {
    expect(canTransitionAttempt("CREATED", "DISPATCH_PENDING")).toBe(true);
    expect(canTransitionAttempt("DISPATCH_PENDING", "DISPATCHED")).toBe(true);
    expect(canTransitionAttempt("DISPATCHED", "CLAIMED")).toBe(true);
    expect(canTransitionAttempt("CLAIMED", "PROCESSING")).toBe(true);
    expect(canTransitionAttempt("PROCESSING", "UPLOADING_RESULT")).toBe(true);
    expect(canTransitionAttempt("UPLOADING_RESULT", "SUCCEEDED")).toBe(true);
  });

  it("keeps terminal attempts immutable", () => {
    expect(isTerminalAttempt("SUCCEEDED")).toBe(true);
    expect(canTransitionAttempt("SUCCEEDED", "PROCESSING")).toBe(false);
    expect(canTransitionAttempt("FAILED", "PROCESSING")).toBe(false);
  });
});
