import * as cheerio from "cheerio";
import { execFile as execFileCallback } from "child_process";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { parseArgs, promisify } from "util";

import { ExtendedSubmission, isErrnoException, isExecFileError } from "../lib/types.js";

const execFile = promisify(execFileCallback);

export const HELP = `
Usage: ... copyDetect [options...]
Options:
    -d <STRING>  : Path to the directory with submissions.
    -l <STRING>  : Language tokenize during copydetection.
    -o <STRING>  : Path to the resulted report. (default: './result.html')

Example: ... copyDetect -d ./data -l cpp -o ./result.html
`;

function error(msg: string) {
    console.log(msg);
    console.log("Use -h: to get usage help.");
}

export async function execute() {
    const {
        values: { dataDir, lang, outFile }
    } = parseArgs({
        options: {
            dataDir: {
                type: "string",
                short: "d",
                default: "./result"
            },
            lang: {
                type: "string",
                short: "l",
                default: "cpp"
            },
            outFile: {
                type: "string",
                short: "o",
                default: "./result.html"
            }
        },
        args: process.argv.slice(3)
    });

    if (!dataDir || !lang || !outFile) {
        error("Arguments don't seem to be correct.");
        return;
    }

    try {
        await execFile("copydetect", ["-t", dataDir, "-e", "src", "-o", lang, "-O", outFile, "-a"]);
    } catch (err) {
        if (isErrnoException(err)) {
            error("copydetect cannot be spawned. Check your environment.");
            return;
        }
        if (isExecFileError(err)) {
            error(`copydetect binary said: ${err.stderr}`);
            return;
        }
    }

    const $ = cheerio.load(await readFile(outFile));

    $(`<h6 style="text-align: center;">Generated on: ${new Date().toString()}</h6>`).insertAfter(
        "div.container h1"
    );

    for (const p of $("tbody.table-light tr td p")) {
        const first = $(p).children("i")[0];
        const second = $(p).children("i")[1];

        const firstPath = path.parse($(first).text());
        const secondPath = path.parse($(second).text());

        const firstData = JSON.parse(
            (await readFile(path.join(firstPath.dir, `${firstPath.name}.json`))).toString()
        ) as ExtendedSubmission;
        const secondData = JSON.parse(
            (await readFile(path.join(secondPath.dir, `${secondPath.name}.json`))).toString()
        ) as ExtendedSubmission;

        $(p).prepend(
            `<b>${firstData.author.members[0].handle} - ${secondData.author.members[0].handle}</b><br>`
        );

        $(first).replaceWith(`<a href="${firstData.url}">${firstData.id}</a>`);
        $(second).replaceWith(`<a href="${secondData.url}">${secondData.id}</a>`);
    }

    try {
        await writeFile(outFile, $.html());
        console.log("✓ Successfully generated report file.");
        console.log(`➜ ${outFile}`);
    } catch {
        console.log("Cannot make report file.");
    }
}

