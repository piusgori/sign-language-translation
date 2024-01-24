export default class HttpError extends Error {
    content?: string | null;
    code?: number;

    constructor (message: string, content?: string | null, code?: number) {
        super(message);
        this.content = content;
        this.code = code;
    }
}