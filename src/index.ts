import { existsSync, readFileSync, writeFileSync } from "fs";

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

const pathToLog = process.argv[3];
const pathToUser = process.argv[4];
const freezeTime = process.argv[2];

console.log(pathToLog, pathToUser);

if (!existsSync(pathToLog) || !existsSync(pathToUser)) {
    console.log("Cannot find path specified.")
}

const logs = readFileSync(pathToLog, "utf-8").trim().split("\n");
const users = readFileSync(pathToUser, "utf-8").trim().split("\n");

const names: Record<string, string> = {};

for (const user of users) {
    const values = user.split(" | ").map(value => value.trim());
    names[values[1]] = values[3];
}

const output: Output = {
    contestName: "",
    freezeTimeMinutesFromStart: parseInt(freezeTime) || 0,
    problemLetters: [],
    contestants: [],
    runs: []
};

for (const log of logs) {
    const cmd = log.slice(0, log.indexOf(" ")).trim();
    const csv = log.slice(log.indexOf(" ") + 1).trim();

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
            }

            output.runs.push(run);
            break;
        }
    }
} 

try {
    writeFileSync("output.json", JSON.stringify(output));
    console.log("✓ Successfully converted contest log file.");
    console.log("➜ output.json");
}
catch {
    console.log("Cannot write to file: output.json");
}



