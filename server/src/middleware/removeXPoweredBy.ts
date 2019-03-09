import { Request, Response, NextFunction } from 'express';

export const removeXPoweredBy = () => (req: Request, res: Response, next: NextFunction) => {
    res.removeHeader('X-Powered-By');
    next();
};
