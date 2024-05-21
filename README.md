# StyleForces

The Codeforces toolkit to make life easier for teachers and worse for students.

> One year I made one thing, next year another. They're small but still useful, so I've bundled them.

## Commands

One binary contains multiple commands, here is the listing.

### log2StanD

Convert contest log to JSON with freeze-time.

```cs
Usage: styleforces log2StanD [options...]
Options:
    --freeze, -f      (INTEGER) : Freeze time counting from start in minutes.
    --log, -l         (STRING)  : Path to the contest log file.
    --domain, -d      (STRING)  : Path to the domain's user's file.
    --only-domain, -i           : Ignore everyone not in domain.
    --out-file, -O    <STRING>  : Path to the resulted serialization. (default: './result.json')
Example: styleforces log2StanD -f 120 -l ./log.txt -d ./domain.txt -o ./result.json
```

> This one was used on a local team Olympiad to make it more exciting for participants.
>
> ACM ICPC like experience powered by [StanD](https://github.com/OStrekalovsky/S4RiS-StanD).

### fetch

Fetch contest submissions ("OK" or point-threshold).

```cs
Usage: styleforces fetch [options...]
Options:
    --contest, -i (STRING)  : Contest ID.
    --group, -g   <STRING>  : Group ID (if in group).
    --count, -c   <INTEGER> : Positive amount of submissions to fetch. (default: 100)
    --lookup, -l  <INTEGER> : Positive amount of submissions to lookup. (default: 200)
    --after, -a   <INTEGER> : Positive amount of submissions to skip. (default: 1)
    --points, -p  <INTEGER> : Positive amount of points to filter. (default: 100)
    --exclude, -e [STRING]  : Index of problems to exclude from fetching.
    --out-dir, -O <STRING>  : Path to the directory to write submissions to. (default: './result')
Example: styleforces fetch -i someId -g anotherId -c 50 -l 100 -a 10 -o './result'
```

> Basically, you do this to make some cool stuff later.

### copydetect

Copydetect wrapper compatible with fetch command.

```cs
Usage: styleforces copydetect [copydetect options...]
Example: styleforces copydetect -t ./data -o cpp -O ./result.html
```

> ⚠️ [copydetect](https://github.com/blingenf/copydetect) needs to be accessible in your environment!

> This makes fabulous HTML copy paste reports over submissions. Easily catch cheaters in your contests.

## Enviroment

More about usage!

### Variables

- **CF_KEY** - Codeforces API Key.
- **CF_SECRET** - Codeforces API Secret.
- **CF_COOKIE** - Cookies extracted from your session.
  
> ❔About cookies: some info isn't accessible through codeforces API, though we need to scrap HTML to access it.

> ❕Moreover contests require **manager** role to access participant's submissions.

### Options

- **--help, -h** - should work everywhere depending on context. **Default:**

```cs
Usage: styleforces (command) [arguments...]
Commands:
    - log2StanD  : Convert contest log to JSON with freeze-time.
    - fetch      : Fetch submission from contest.
    - copydetect : Compare submissions and generate copy report of them. (requires copydetect)
Environment:
    CF_KEY    : Codeforces API Key.
    CF_SECRET : Codeforces API Secret.
    CF_COOKIE : Cookies extracted from your session.
```

## Bundles

> Maybe later...

## Postface

**[Licence](https://github.com/unknowableshade/StyleForces/blob/master/LICENCE)**

**_Thank you for your attention!_**
