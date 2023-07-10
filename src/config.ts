import path from "path";

const ROOT = __dirname;

const config = {
    cfUrl: "https://codeforces.com",
    cfEndpoint: "https://codeforces.com/api",
    cfKey: process.env.CF_KEY,
    cfSecret: process.env.CF_SECRET,
    distDir: path.join(ROOT, "../data/"),
    headers: {
        Host: "codeforces.com",
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '""',
        "Upgrade-Insecure-Requests": "1",
        "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.199 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-User": "?1",
        "Sec-Fetch-Dest": "document",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "en-US,en;q=0.9",
        Cookie: process.env.CF_COOKIE ?? ""
    }
};

export default config;
