type ArbitraryObject = { [key: string]: unknown };

function isArbitraryObject(potentialObject: unknown): potentialObject is ArbitraryObject {
    return !!potentialObject && typeof potentialObject === "object";
}

export type ParticipantType =
    | "CONTESTANT"
    | "PRACTICE"
    | "VIRTUAL"
    | "MANAGER"
    | "OUT_OF_COMPETITION";
export type ProblemType = "PROGRAMMING" | "QUESTION";
export type VerdictType =
    | "FAILED"
    | "OK"
    | "PARTIAL"
    | "COMPILATION_ERROR"
    | "RUNTIME_ERROR"
    | "WRONG_ANSWER"
    | "PRESENTATION_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "IDLENESS_LIMIT_EXCEEDED"
    | "SECURITY_VIOLATED"
    | "CRASHED"
    | "INPUT_PREPARATION_CRASHED"
    | "CHALLENGED"
    | "SKIPPED"
    | "TESTING"
    | "REJECTED";
export type TestSetType =
    | "SAMPLES"
    | "PRETESTS"
    | "TESTS"
    | "CHALLENGES"
    | "TESTS1"
    | "TESTS2"
    | "TESTS3"
    | "TESTS4"
    | "TESTS5"
    | "TESTS6"
    | "TESTS7"
    | "TESTS8"
    | "TESTS9"
    | "TESTS10";

export interface BaseProblem {
    contestId?: number;
    problemsetName: string;
    index: string;
    name: string;
    type: ProblemType;
    tags: string[];
    points?: number;
    rating?: number;
}

export interface BaseMember {
    handle: string;
    name?: string;
}

export interface BaseParty {
    contestId?: number;
    members: BaseMember[];
    participantType: ParticipantType;
    ghost: boolean;
    startTimeSeconds?: number;
    teamId?: number;
    teamName?: string;
    room?: number;
}

export interface BaseSubmission {
    id: number;
    contestId?: number;
    creationTimeSeconds: number;
    relativeTimeSeconds: number;
    problem: BaseProblem;
    author: BaseParty;
    programmingLanguage: string;
    verdict?: VerdictType;
    testset: TestSetType;
    passedTestCount: number;
    timeConsumedMillis: number;
    memoryConsumedBytes: number;
    points?: number;
}

export interface ExtendedSubmission extends BaseSubmission {
    source: string;
    csrf?: string;
    url: string;
    groupId?: string;
}

export interface ErrnoException extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
}

export function isErrnoException(error: unknown): error is ErrnoException {
    return (
        isArbitraryObject(error) &&
        error instanceof Error &&
        (typeof error.errno === "number" || typeof error.errno === "undefined") &&
        (typeof error.code === "string" || typeof error.code === "undefined") &&
        (typeof error.path === "string" || typeof error.path === "undefined") &&
        (typeof error.syscall === "string" || typeof error.syscall === "undefined")
    );
}

export interface ExecFileError extends Error {
    cmd: string;
    code: number;
    killed: boolean;
    signal: object;
    stderr: string;
    stdout: string;
}

export function isExecFileError(error: unknown): error is ExecFileError {
    return (
        isArbitraryObject(error) &&
        error instanceof Error &&
        typeof error.cwd === "string" &&
        typeof error.code === "number" &&
        typeof error.killed === "boolean" &&
        typeof error.signal === "object" &&
        typeof error.stderr === "string" &&
        typeof error.stdout === "string"
    );
}
