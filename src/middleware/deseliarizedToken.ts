import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt";

const deserializedToken = (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization?.replace(/^Bearer\s/, '');

    if (!accessToken) {
        return next();
    }

    const token: any = verifyJwt(accessToken);

    if (token.decoded) {
        res.locals.user = token.decoded;
    }

    next();
};


export default deserializedToken;

// Definisikan properti userId di dalam objek Request
declare global {
    namespace Express {
        interface Request {
            userId?: String;
            user?: any; // Properti user dengan tipe data yang sesuai, misalnya { id: number }
        }
    }
}
