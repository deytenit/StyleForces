import { parseArgs } from "util";

import * as copyDetect from "./command/copydetect.js";
import * as fetchOK from "./command/fetchOk.js";
import * as logSerializer from "./command/logSerializer.js";

const HELP = `
Usage: ... (command) [arguments...]
Commands:
    - logSerializer : Convert contest log to JSON with freeze-time.
    - fetchOk       : Fetch every "OK" submission from contest.
    - copydetect    : Compare submissions and generate copy report of them. (requires copydetect) 
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
    case "logSerializer":
        if (help) {
            console.log(logSerializer.HELP);
            break;
        }
        logSerializer.execute();
        break;
    case "fetchOk":
        if (help) {
            console.log(fetchOK.HELP);
            break;
        }
        fetchOK.execute();
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
