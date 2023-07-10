import * as copyDetect from "./command/copyDetect.js";
import * as fetchOk from "./command/fetchOk.js";
import * as logSerializer from "./command/logSerializer.js";

const HELP = `
Usage: ... (command) [arguments...]
Commands:
    - logSerializer : Convert contest log to JSON with freeze-time.
    - fetchOk       : Fetch every "OK" submission from contest.
    - copyDetect    : Compare submissions and generate copy report of them. (requires copydetect) 
Environment:
    CF_KEY    : Codeforces API Key.
    CF_SECRET : Codeforces API Secret.
    CF_COOKIE : Cookies extracted from your session.
`;

const help = !!process.argv.find((arg) => arg === "-h");

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
            console.log(fetchOk.HELP);
            break;
        }
        fetchOk.execute();
        break;
    case "copyDetect":
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
