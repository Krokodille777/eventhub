export abstract class DomainError extends Error {
    constructor(message: string){
        super(message);
        this.name = new.target.name;
    }
}

export class EventNotFound extends DomainError {
    constructor (readonly eventid: string){
        super(`Event with id ${eventid} not found`);
    }
}

export interface ValidationIssue{
    field: string;
    code: string;
    message: string;
}

export class RequestValidationFailed extends DomainError{
    constructor(readonly issues: ValidationIssue[]){
        super("Request validation failed");
    }
}

export class InvalidCursor extends DomainError {
    constructor (readonly raw: string){
        super("Invalid pagination cursor: " + raw);
    }
}
