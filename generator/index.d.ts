declare type Config = {
    mode: "basic" | "database",
    pasteOptions: {
        write: boolean,
        outFile: string
    },
    scriptOptions: {
        write: boolean,
        outFile: string,
        inFile: string,
        removeComments: boolean,
        removeNewlines: boolean,
        minimizeWhitespace: boolean
    },
    badCharacters: Array<string>
}