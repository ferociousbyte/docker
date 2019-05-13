interface BuildInformation {
    name: string;
    folder: string;
    args: object;
    tags: string[];
}

async function loadConfig(file: string): Promise<BuildInformation[]> {
    const textDecoder = new TextDecoder("utf-8");
    const data = await Deno.readFile(file);
    const info: BuildInformation[] = JSON.parse(textDecoder.decode(data));

    return Promise.resolve(info);
}

function createPushCommand(name: string): string[] {
    return [
        "docker",
        "push",
        name
    ];
}
function createBuildCommand(buildInformation: BuildInformation): string[] {
    let cmd = [
        "docker",
        "build",
        // "--no-cache",
        "--rm"
    ];
    for (let v in buildInformation.args) {
        for (let i in buildInformation.args)
            buildInformation.args[v] = buildInformation.args[v].replace("${" + i + "}", buildInformation.args[i]);

        cmd.push("--build-arg")
        cmd.push(v + "=" + buildInformation.args[v])
    }
    for (let v in buildInformation.tags) {
        for (let i in buildInformation.args)
            buildInformation.tags[v] = buildInformation.tags[v].replace("${" + i + "}", buildInformation.args[i]);

        cmd.push("-t");
        cmd.push(buildInformation.name + ":" + buildInformation.tags[v]);
    }
    cmd.push(buildInformation.folder);

    return cmd;
}

(async () => {
    const config = await loadConfig("build-config.json");

    for (let i = 0; i < config.length; i++) {
        const build = createBuildCommand(config[i]);
        const push = createPushCommand(config[i].name);

        console.log(build);
        console.log(push);

        await Deno.run({
            args: build
        }).status();
        await Deno.run({
            args: push
        }).status();
    }
})();