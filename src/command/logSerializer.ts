import { readFile, writeFile } from "fs/promises";
import { parseArgs } from "util";

interface Run {
    contestant: string;
    problemLetter: string;
    timeMinutesFromStart: number;
    success: boolean;
}

interface Output {
    contestName: string;
    freezeTimeMinutesFromStart: number;
    problemLetters: string[];
    contestants: string[];
    runs: Run[];
}

export const HELP = `
Usage: ... logSerializer [options...]
Options:
    -f (INTEGER) : Freeze time counting from start in minutes.
    -l (STRING)  : Path to the contest log file.
    -d (STRING)  : Path to the domain's users file.
    -o <STRING>  : Path to the resulted serialization. (default: './result.json')

Example: ... logSerializer -f 120 -l ./log.txt -d ./domain.txt -o ./result.json
`;

function error(msg: string) {
    console.log(msg);
    console.log("Use -h: to get usage help.");
}

export async function execute() {
    const {
        values: { freezeTime, logFile, domainFile, outFile }
    } = parseArgs({
        options: {
            freezeTime: {
                type: "string",
                short: "f"
            },
            logFile: {
                type: "string",
                short: "l"
            },
            domainFile: {
                type: "string",
                short: "d"
            },
            outFile: {
                type: "string",
                short: "o",
                default: "./result.json"
            }
        },
        args: process.argv.slice(3)
    });

    if (!freezeTime || !logFile || !domainFile || !outFile) {
        error("Arguments don't seem to be correct.");
        return;
    }

    if (!/^(0|[1-9]\d*)$/.test(freezeTime)) {
        error("Freezetime doesn't seem to be correct.");
        return;
    }

    let log: string[];
    let domain: string[];

    try {
        log = (await readFile(logFile, "utf-8")).trim().split("\n");
        domain = (await readFile(domainFile, "utf-8")).trim().split("\n");
    } catch {
        error("Log/domain file is unreachable.");
        return;
    }

    const names: Record<string, string> = {};

    for (const user of domain) {
        const values = user.split(" | ").map((value) => value.trim());
        names[values[1]] = values[3];
    }

    const output: Output = {
        contestName: "",
        freezeTimeMinutesFromStart: parseInt(freezeTime) || 0,
        problemLetters: [],
        contestants: [],
        runs: []
    };

    for (const entry of log) {
        const cmd = entry.slice(0, entry.indexOf(" ")).trim();
        const csv = entry.slice(entry.indexOf(" ") + 1).trim();

        switch (cmd) {
            case "@contest": {
                output.contestName = csv.replace(/"/g, "");
                break;
            }
            case "@p": {
                const values = csv.split(",");
                output.problemLetters.push(values[0]);
                break;
            }
            case "@t": {
                const values = csv.split(",");
                output.contestants.push(names[values[3].split("=")[1]]);
                break;
            }
            case "@s": {
                const values = csv.split(",");
                const run: Run = {
                    contestant: output.contestants[parseInt(values[0]) - 1],
                    problemLetter: values[1],
                    timeMinutesFromStart: Math.floor(parseInt(values[3]) / 60),
                    success: values[4] === "OK"
                };

                output.runs.push(run);
                break;
            }
        }
    }

    try {
        await writeFile(outFile, JSON.stringify(output));
        console.log("✓ Successfully serialized contest log file.");
        console.log(`➜ ${outFile}`);
    } catch {
        console.log("Cannot write result of serialization.");
    }
}
