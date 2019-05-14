import { readJson } from "https://deno.land/std/fs/mod.ts";
import { encode } from "https://deno.land/std/strings/strings.ts";


interface BuildInformation {
    name: string;
    folder: string;
    args: object;
    tags: string[];
    verbose?: boolean;
}
interface ProcOutput {
    code: number,
    message: Uint8Array
}

function rewrite(buildInfo: BuildInformation): void {
    for (let v in buildInfo.args) {
        for (let i in buildInfo.args)
            buildInfo.args[v] = buildInfo.args[v].replace("${" + i + "}", buildInfo.args[i]);
    }
    for (let v in buildInfo.tags) {
        for (let i in buildInfo.args)
            buildInfo.tags[v] = buildInfo.tags[v].replace("${" + i + "}", buildInfo.args[i]);
    }
}

async function build(buildInfo: BuildInformation): Promise<ProcOutput> {
    let cmd = [
        "docker",
        "build",
        // "--no-cache",
        "--rm"
    ];
    for (let v in buildInfo.args) {
        cmd.push("--build-arg")
        cmd.push(v + "=" + buildInfo.args[v])
    }
    for (let v in buildInfo.tags) {
        cmd.push("-t");
        cmd.push(buildInfo.name + ":" + buildInfo.tags[v]);
    }
    cmd.push(buildInfo.folder);

    const proc = Deno.run({
        args: cmd,
        stdout: (buildInfo.verbose ? "inherit" : "piped"),
        stderr: (buildInfo.verbose ? "inherit" : "piped")
    });
    const { code } = await proc.status();
    return Promise.resolve<ProcOutput>({ code: code, message: buildInfo.verbose ? new Uint8Array() : (await (code === 0 ? proc.output() : proc.stderrOutput())) });
}

async function push(buildInfo: BuildInformation): Promise<ProcOutput> {
    const procOutput = { code: 0, message: new Uint8Array() };

    for (let tag of buildInfo.tags) {
        const proc = Deno.run({
            args: [
                "docker",
                "push",
                buildInfo.name + ":" + tag
            ],
            stdout: (buildInfo.verbose ? "inherit" : "piped"),
            stderr: (buildInfo.verbose ? "inherit" : "piped")
        });
        const { code } = await proc.status();

        if (code !== 0) {
            procOutput.code = code;
            procOutput.message = await proc.stderrOutput();
            break;
        }
    }
    return Promise.resolve<ProcOutput>(procOutput);
}

(async () => {
    const config = <BuildInformation[]>(await readJson("build-config.json"));
    const decoder = new TextDecoder();
    let output = <ProcOutput>{};

    for (let i = 0; i < config.length; i++) {
        rewrite(config[i]);

        Deno.stdout.write(encode("Building <" + config[i].name + "> ... "));
        if ((output = await build(config[i])).code !== 0) {
            console.log(decoder.decode(output.message));
            Deno.exit(output.code);
            return;
        }
        Deno.stdout.write(encode("done\n"));

        Deno.stdout.write(encode("Pushing <" + config[i].name + "> ..."));
        if ((output = await push(config[i])).code !== 0) {
            console.log(decoder.decode(output.message));
            Deno.exit(output.code);
            return;
        }
        Deno.stdout.write(encode("done\n"));
    }
})();