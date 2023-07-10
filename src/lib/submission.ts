import * as cheerio from "cheerio";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import config from "../config.js";
import { BaseSubmission, ExtendedSubmission } from "./types.js";

function submissionUrl(id: string, contestId?: string, groupId?: string) {
    const groupPath = groupId ? "/group/" + groupId : "";
    const contestPath = contestId ? "/contest/" + contestId : "";
    const submissionPath = "/submission/" + id;

    return config.cfUrl + groupPath + contestPath + submissionPath;
}

export default class Submission {
    public readonly data: ExtendedSubmission;

    constructor(submission: ExtendedSubmission) {
        this.data = submission;
    }

    public async ignore(): Promise<void> {
        await fetch(this.data.url, {
            headers: config.headers,
            body: new URLSearchParams({
                csrf_token: this.data.csrf,
                action: "ignore",
                submissionId: this.data.id.toString(),
                submit: "Ignore"
            }),
            method: "POST"
        });
    }

    public async save(dir: string): Promise<void> {
        const dist = path.join(dir, this.data.id.toString());

        await mkdir(dist, { recursive: true });
        await writeFile(path.join(dist, `${this.data.id}.json`), JSON.stringify(this.data));
        await writeFile(path.join(dist, `${this.data.id}.src`), this.data.source);
    }

    static async fetch(submission: BaseSubmission, groupId?: string): Promise<Submission> {
        const url = submissionUrl(
            submission.id.toString(),
            submission.contestId?.toString(),
            groupId
        );

        const html = await fetch(url, {
            headers: config.headers
        }).then((res) => res.text());

        const $ = cheerio.load(html);

        try {
            const source = $("#program-source-text").text();
            const csrf = $("form.submission-action-form input[name=csrf_token]").attr().value;
            return new Submission({ ...submission, source, csrf, url, groupId });
        } catch {
            throw new Error("Cannot access source code of the submission.");
        }
    }
}
