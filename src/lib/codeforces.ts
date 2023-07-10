import { createHash, randomBytes } from "crypto";

import config from "../config.js";
import { BaseSubmission } from "./types.js";

function hashedQuery(method: string, queries: [string, string][]): string {
    const query =
        "?" +
        [
            ["apiKey", config.cfKey],
            ["time", (Date.now() / 1000).toFixed(0)]
        ]
            .concat(queries)
            .sort()
            .map((pair) => pair.join("="))
            .join("&");

    const rand = randomBytes(3).toString("hex");

    const sig =
        rand +
        createHash("sha512").update(`${rand}${method}${query}#${config.cfSecret}`).digest("hex");

    return `${query}&apiSig=${sig}`;
}

export class CfApiError implements Error {
    name = "CfApiError";
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}

export const methods = {
    contestStatus: async (contestId: string, from = 1, count = 10): Promise<BaseSubmission[]> => {
        const method = "/contest.status";

        const query = hashedQuery(method, [
            ["contestId", contestId],
            ["from", from.toString()],
            ["count", count.toString()]
        ]);

        const url = config.cfEndpoint + method + query;

        const data = await fetch(url).then((res) => res.json());
        
        if (data.status !== "OK") {
            throw new CfApiError(data.reason);
        }

        return data.result;
    }
};
