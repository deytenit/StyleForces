import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { parseArgs } from "util";

import * as codeforces from "../lib/codeforces.js";
import Submission from "../lib/submission.js";
import { BaseProblem, isErrnoException } from "../lib/types.js";

type SubmissionIndex = {
    [handle: string]: BaseProblem[];
};

export const HELP = `
Usage: ... fetchOk [options...]
Options:
    -i (STRING)  : Contest ID.
    -g <STRING>  : Group ID (if in group).
    -c <INTEGER> : Positive amount of "OK" submissions to fetch. (default: 100)
    -l <INTEGER> : Positive amouut of submissions to lookup. (default: 200)
    -a <INTEGER> : Positive amount of submissions to skip. (default: 1)
    -o <STRING>  : Path to the directory to write submissions to. (default: './result')

Example: ... fetchOk -i someId -g anotherId -c 50 -l 100 -a 10 -o './result'
`;

function error(msg: string) {
    console.log(msg);
    console.log("Use -h: to get usage help.");
}

export async function execute() {
    const {
        values: { contestId, groupId, countArg, lookupArg, afterArg, outDir }
    } = parseArgs({
        options: {
            contestId: {
                type: "string",
                short: "i"
            },
            groupId: {
                type: "string",
                short: "g"
            },
            countArg: {
                type: "string",
                short: "c"
            },
            lookupArg: {
                type: "string",
                short: "l"
            },
            afterArg: {
                type: "string",
                short: "a"
            },
            outDir: {
                type: "string",
                short: "o",
                default: "./output"
            }
        },
        args: process.argv.slice(3)
    });

    const count = countArg && /^(0|[1-9]\d*)$/.test(countArg) ? parseInt(countArg) : 100;
    const lookup = lookupArg && /^(0|[1-9]\d*)$/.test(lookupArg) ? parseInt(lookupArg) : 200;
    const after = afterArg && /^(0|[1-9]\d*)$/.test(afterArg) ? parseInt(afterArg) : 1;

    if (!contestId || !outDir) {
        error("Arguments don't seem to be correct.");
        return;
    }

    try {
        await mkdir(outDir, { recursive: true });
    } catch {
        error("Out directory cannot be made.");
        return;
    }

    const indexPath = path.join(outDir, "index.json");

    let index: SubmissionIndex;
    try {
        index = JSON.parse((await readFile(indexPath)).toString()) as SubmissionIndex;
    } catch {
        index = {};
    }

    const status = (await codeforces.methods.contestStatus(contestId, after, lookup))
        .filter((submission) => submission.verdict === "OK")
        .slice(0, count);

    for (const submission of status) {
        if (!Object.hasOwn(index, submission.author.members[0].handle)) {
            index[submission.author.members[0].handle] = [];
        }

        if (
            index[submission.author.members[0].handle].find(
                (problem) =>
                    problem.contestId === submission.contestId &&
                    problem.name === submission.problem.name
            )
        ) {
            continue;
        }

        try {
            await Submission.fetch(submission, groupId).then((res) => res.save(outDir));
        } catch (err) {
            if (isErrnoException(error)) {
                error(`Cannot write submission "${submission.id}".`);
                return;
            }
            if (err instanceof Error) {
                error(err.message);
                return;
            }
        }

        index[submission.author.members[0].handle].push(submission.problem);
    }

    console.log("✓ Successfully fetched submissions.");
    console.log(`➜ ${outDir}`);

    try {
        await writeFile(indexPath, JSON.stringify(index));
        console.log("✓ Index captured.");
    } catch {
        error("Index haven't been saved! Next run will overwrite submissions.");
        return;
    }
}

