import { Request } from 'express';

export interface TokenRequest extends Request {
    id?: string;
    user?: any;
}