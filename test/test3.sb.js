
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
    let index = args.findIndex(i => i.startsWith('expression:'));
    if (index === -1) return { newArgs: args }
    let expressionString = args.slice(index).join(' ');
    // anything before the index will be kept
    let newArgs = args.slice(index);

    let stringSplit = expressionString.split(':');
    stringSplit.shift();
    let firstExpression =  stringSplit.join(':');

    let expression;
    if (firstExpression.startsWith('"')) {
        expression = firstExpression.match(new RegExp('"(.*?)"'))?.[1];
        // edit the expression out of the args
        newArgs.concat(...[])
    } else {
        expression = firstExpression.split(' ')[0];
        newArgs.concat(args.slice(index + 1));
    }
    return { expression, newArgs};
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

