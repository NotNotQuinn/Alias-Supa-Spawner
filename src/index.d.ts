
declare const args: Array<string> | null;

declare type SubCommandReturnType = {
    reply: undefined;
    success?: boolean;
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