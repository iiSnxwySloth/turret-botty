import * as Eris from "eris";
import * as auth from "../config/auth";
import util from "../types/util";
import * as config from "../config/config";
import { post } from "chainfetch";
import Command from "../classes/abstract/command";

export default class evalC extends Command {
    constructor() {
        super(
            "eval",
            "Developer",
            "Developer",
            "(code)",
            "Execute javascript code",
        );
    }

    public execute = async (
        util: util,
        command: string,
        args: string[],
        msg: Eris.Message,
    ) => {
        const haste = async (content: string) => {
            const res = await post("https://hastebin.com/documents").send(
                `// ${new Date()}\n${content}`,
            );
            return util.client.createMessage(
                msg.channel.id,
                "https://hastebin.com/" + res.body.key,
            );
        };

        let hrstart;
        let code = args.join(" ");
        if (code.startsWith("```js") && code.endsWith("```"))
            code = code.substr(6, code.length - 5 - 5);

        let result = "";
        try {
            const asyncEval = (code: string, returns: boolean) =>
                `(async () => {${
                    !returns ? `return ${code.trim()}` : `${code.trim()}`
                }})()`;
            hrstart = process.hrtime();
            result = await eval(asyncEval(code, code.includes("return")));
        } catch (err) {
            let _err = err
                ? err
                : "an error occured, however no error was actually provided";
            if (_err.stack ? _err.stack.length : _err.length <= 1980) {
                return await util.client.createMessage(msg.channel.id, {
                    embed: {
                        color: config.colors.error,
                        description: `\`\`\`\n${
                            _err.stack ? _err.stack : _err
                        }\n\`\`\``,
                        footer: {
                            text: `Execution time: ${
                                process.hrtime(hrstart)[0]
                            }s ${Math.floor(
                                process.hrtime(hrstart)[1] / 1000000,
                            )}ms`,
                        },
                        timestamp: new Date(),
                    },
                });
            } else {
                return haste(
                    `// eval results\n// error\n// Execution time: ${
                        process.hrtime(hrstart)[0]
                    }s ${Math.floor(
                        process.hrtime(hrstart)[1] / 1000000,
                    )}ms\n\n${err}`,
                );
            }
        }
        if (typeof result !== "string")
            result = require("util").inspect(result);
        result = result.replace(
            util.client.token ? util.client.token : "wtf theres no token??????",
            "TOKEN",
        );
        result = result.replace(auth.discord.token, "TOKEN");

        result = result.replace(auth.database.host, "DBHOST");
        result = result.replace(auth.database.password, "DBPW");

        if (result.length <= 1980) {
            return util.client.createMessage(msg.channel.id, {
                embed: {
                    color: config.colors.success,
                    description: `\`\`\`\n${result}\n\`\`\``,
                    footer: {
                        text: `Execution time: ${
                            process.hrtime(hrstart)[0]
                        }s ${Math.floor(
                            process.hrtime(hrstart)[1] / 1000000,
                        )}ms`,
                    },
                    timestamp: new Date(),
                },
            });
        } else {
            return haste(
                `// eval results\n// no error\n// Execution time: ${
                    process.hrtime(hrstart)[0]
                }s ${Math.floor(
                    process.hrtime(hrstart)[1] / 1000000,
                )}ms\n\n${result}`,
            );
        }
    };
}
