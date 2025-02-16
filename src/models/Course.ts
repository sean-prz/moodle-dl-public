export class Course {
    id: string;
    title?: string;

    constructor(id: string, title?: string) {
        this.id = id;
        this.title = title;
    }

    toString(): string {
        return `${this.id} - ${this.title}`;
    }
}