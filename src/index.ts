import { parseArgs } from "util";

import * as copyDetect from "./command/copydetect.js";
import * as fetchSubmissions from "./command/fetch.js";
import * as log2stanD from "./command/log2StanD.js";

const HELP = `
Usage: ... (command) [arguments...]
Commands:
    - log2StanD  : Convert contest log to JSON with freeze-time.
    - fetch      : Fetch submission from contest.
    - copydetect : Compare submissions and generate copy report of them. (requires copydetect) 
Environment:
    CF_KEY    : Codeforces API Key.
    CF_SECRET : Codeforces API Secret.
    CF_COOKIE : Cookies extracted from your session.
`;

const {
    values: { help }
} = parseArgs({
    options: {
        help: {
            type: "boolean",
            short: "h"
        }
    },
    args: process.argv.slice(3),
    strict: false
});

switch (process.argv[2]) {
    case "log2StanD":
        if (help) {
            console.log(log2stanD.HELP);
            break;
        }
        log2stanD.execute();
        break;
    case "fetch":
        if (help) {
            console.log(fetchSubmissions.HELP);
            break;
        }
        fetchSubmissions.execute();
        break;
    case "copydetect":
        if (help) {
            console.log(copyDetect.HELP);
            break;
        }
        copyDetect.execute();
        break;
    default:
        console.log(HELP);
        break;
}
