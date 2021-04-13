
declare const args: Array<string>;

declare type SubCommandReturnType = {
    reply: undefined;
    success: undefined;
    command: string;
} | {
    reply: string;
    success: undefined | boolean;
    command: undefined;
}

declare type SubCommand = {
    name: string;
    alieses: Array<string>;
    code: () => SubCommandReturnType;
    help: string | null;
}