/** Arguments passed to script if `function:"code"` is used. */
declare var args: string[] | null;
/** The person who executes the command's username. */
declare var executor: string;
/** The channel the command is executed in. */
declare var channel: string;
/** The name of the platform the command is executed in. */
declare var platform: string;
/** Console is undefined in dankdebug. */
declare var console: undefined;
/** Eval will throw an error in dankdebug.  */
declare var eval: (x: string) => never;

/**
 * Utility methods allowed to the script.
 */
declare var utils: {
    // classes
    Date: typeof import('supi-core/objects/date');

    // sb.Utils methods
    capitalize: (...args: any[]) => any;
    randArray: (...args: any[]) => any,
    random: (...args: any[]) => any,
    randomString: (...args: any[]) => any,
    removeAccents: (...args: any[]) => any,
    timeDelta: (...args: any[]) => any,
    wrapString: (...args: any[]) => any,
    zf: (...args: any[]) => any
	
    // other methods
    /**
     * Picks best availible emote for context
     */
    getEmote: (arr: string[], fallback: string) => string;
};

// because this file has no exports or imports, it is global within the folder.
