export class ServerError extends Error { }


export class BadRequestError extends ServerError {
    constructor() {
        super("Bad request error.");
    }
}


export class ServerNotResponsingError extends ServerError {
    constructor() {
        super("Server is not responding.");
    }
}


export class IncompatibleVersionError extends ServerError {
    constructor() {
        super("Incompatible version of the widget and the server.");
    }
}


export class InvalidAuthenticationData extends ServerError {
    constructor() {
        super("Invalid authentication data.");
    }
}


export class UnknownCommandNameError extends ServerError {
    constructor(commandName: string) {
        super(`Unknown command: '${commandName}'.`);
    }
}


export class InvalidCommandParametersError extends ServerError {
    constructor(commandName: string, params: any) {
        super(
            `
                Invalid command parameters command: '${commandName}';
                params: ${params}.
            `
        );
    }
}
