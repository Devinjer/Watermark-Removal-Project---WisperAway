export const JOB_LIFECYCLE_STATES = [
  "DRAFT",
  "READY",
  "DELETING",
  "DELETED",
  "EXPIRED",
] as const;

export type JobLifecycleState = (typeof JOB_LIFECYCLE_STATES)[number];

export const ATTEMPT_STATES = [
  "CREATED",
  "DISPATCH_PENDING",
  "DISPATCHED",
  "CLAIMED",
  "PROCESSING",
  "UPLOADING_RESULT",
  "SUCCEEDED",
  "FAILED",
  "CANCELLED",
  "EXPIRED",
] as const;

export type AttemptState = (typeof ATTEMPT_STATES)[number];

const jobTransitions: Record<JobLifecycleState, readonly JobLifecycleState[]> = {
  DRAFT: ["READY", "DELETING", "EXPIRED"],
  READY: ["DELETING", "EXPIRED"],
  DELETING: ["DELETED"],
  DELETED: [],
  EXPIRED: [],
};

const attemptTransitions: Record<AttemptState, readonly AttemptState[]> = {
  CREATED: ["DISPATCH_PENDING", "CANCELLED"],
  DISPATCH_PENDING: ["DISPATCHED", "FAILED", "CANCELLED"],
  DISPATCHED: ["CLAIMED", "FAILED", "CANCELLED", "EXPIRED"],
  CLAIMED: ["PROCESSING", "FAILED", "CANCELLED", "EXPIRED"],
  PROCESSING: ["UPLOADING_RESULT", "FAILED", "CANCELLED", "EXPIRED"],
  UPLOADING_RESULT: ["SUCCEEDED", "FAILED", "CANCELLED", "EXPIRED"],
  SUCCEEDED: [],
  FAILED: [],
  CANCELLED: [],
  EXPIRED: [],
};

export function canTransitionJob(from: JobLifecycleState, to: JobLifecycleState): boolean {
  return jobTransitions[from].includes(to);
}

export function canTransitionAttempt(from: AttemptState, to: AttemptState): boolean {
  return attemptTransitions[from].includes(to);
}

export function isTerminalAttempt(state: AttemptState): boolean {
  return ["SUCCEEDED", "FAILED", "CANCELLED", "EXPIRED"].includes(state);
}
