
/**
 * Function that applies alias parameters to string.
 * @param {string[]} templatedArguments Expression to apply.
 * @param {string[]} inputArguments Arguments to apply parameters to.
 */
const applyParameters = (templatedArguments, inputArguments) => {
    const resultArguments = [];
    const numberRegex = /(?<order>-?\d+)(\.\.(?<range>-?\d+))?(?<rest>\+?)/;

    for (let i = 0; i < templatedArguments.length; i++) {
        const parsed = templatedArguments[i].replace(/#{(.+?)}/g, (total, match) => {
            const numberMatch = match.match(numberRegex);
            if (numberMatch) {
                let order = Number(numberMatch.groups.order);
                if (order < 0) {
                    order = inputArguments.length + order;
                }

                let range = (numberMatch.groups.range) ? Number(numberMatch.groups.range) : null;
                if (typeof range === "number") {
                    if (range < 0) {
                        range = inputArguments.length + range + 1;
                    }

                    if (range < order) {
                        const temp = range;
                        range = order;
                        order = temp;
                    }
                }

                const useRest = (numberMatch.groups.rest === "+");
                if (useRest && range) {
                    return {
                        success: false,
                        reply: `Cannot combine both the "range" and "rest" argument identifiers!`
                    };
                }
                else if (useRest) {
                    return inputArguments.slice(order).join(" ");
                }
                else if (range) {
                    return inputArguments.slice(order, range).join(" ");
                }
                else {
                    return inputArguments[order] ?? "";
                }
            }
            else if (match === "executor") {
                return executor;
            }
            else if (match === "channel") {
                return channel;
            }
            else {
                return total;
            }
        });

        resultArguments.push(...parsed.split(" "));
    }

    return {
        success: true,
        resultArguments
    };
}
/** @param {string} msg */
const error = (msg) => `abb ac 0 a em:"${msg.replace('"', '\'')}"`;
/** @param {string} msg */
const success = (msg) => `abb say ${msg}`;

/**
 * Gets the expression if present in arguments message. 
 * @param {string[]} args
 */
function getExpression (args) {
    let output;
    const paramNames = [{name:"expression", type:"string"}].map(i => i.name);

    let argsString = args.join(" ");
    const quotesRegex = new RegExp(`(?<name>${paramNames.join("|")}):(?<!\\\\)"(?<value>.*?)(?<!\\\\)"`, "g");
    const quoteMatches = [...argsString.matchAll(quotesRegex)];

    for (const match of quoteMatches.reverse()) {
        argsString = argsString.slice(0, match.index) + argsString.slice(match.index + match[0].length + 1);

        const { name = null, value = null } = match.groups;
        const { type } = [{name:"expression", type:"string"}].find(i => i.name === name);

        if (name !== null && value !== null) {
            const cleanValue = value.replace(/^"|"$/g, "").replace(/\\"/g, "\"");
            const parsedValue = cleanValue
            if (parsedValue === null) {
                sb.CooldownManager.unsetPending(userData.ID);
                return {
                    success: false,
                    reply: `Cannot parse parameter "${name}"!`
                };
            }

            output = parsedValue;
        }
    }

    const remainingArgs = argsString.split(" ");
    const paramRegex = new RegExp(`^(?<name>${paramNames.join("|")}):(?<value>.*)$`);
    for (let i = remainingArgs.length - 1; i >= 0; i--) {
        if (!paramRegex.test(remainingArgs[i])) {
            continue;
        }

        const { name = null, value = null } = remainingArgs[i].match(paramRegex).groups;
        const { type } = [{name:"expression", type:"string"}].find(i => i.name === name);

        if (name !== null && value !== null) {
            const parsedValue = String(value);
            if (parsedValue === null) {
                sb.CooldownManager.unsetPending(userData.ID);
                return {
                    success: false,
                    reply: `Cannot parse parameter "${name}"!`
                };
            }

            output = parsedValue;
            remainingArgs.splice(i, 1);
        }
    }

    args = remainingArgs.filter(Boolean);

    return { expression: output, newArgs: args };
}
console.log('old args', args)
const { expression, newArgs } = getExpression(args);
console.log({ expression, newArgs })

if (expression == null) return success(newArgs.join(' '));

let res = applyParameters(expression.split(' '), newArgs)
console.log({res})
if (res.success)
    return success(res.resultArguments.join(' '));
else return error(res.reply)

