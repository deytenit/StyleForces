import * as cheerio from "cheerio";
import { execFile as execFileCallback } from "child_process";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { parseArgs, promisify } from "util";

import { ExtendedSubmission, isErrnoException, isExecFileError } from "../lib/types.js";

const execFile = promisify(execFileCallback);

export const HELP = `
Usage: ${process.execPath} copydetect [copydetect options...]
Example: ${process.execPath} copydetect -t ./data -o cpp -O ./result.html
`;

function error(msg: string) {
    console.log(msg);
    console.log("Use -h: to get usage help.");
}

export async function execute() {
    const {
        values: { "out-file": outFileArg }
    } = parseArgs({
        options: {
            "out-file": {
                type: "string",
                short: "O"
            }
        },
        args: process.argv.slice(3),
        strict: false
    });

    let outFile = typeof outFileArg === "boolean" || !outFileArg ? "./result.html" : outFileArg;

    if (!outFile.endsWith(".html")) {
        outFile = path.join(outFile, "./result.html");
    }

    try {
        await execFile("copydetect", process.argv.slice(3).concat(["-O", outFile, "-a"]));
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
            `<b>${firstData.author.members[0].name ?? firstData.author.members[0].handle} - ${
                secondData.author.members[0].name ?? secondData.author.members[0].handle
            }</b><br>`
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

