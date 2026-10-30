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
