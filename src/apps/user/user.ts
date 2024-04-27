import express , {Request, Response, NextFunction} from "express";
import prisma from "../../db";
import { logger } from "../../utils/logger";
import { createUserValidation } from "./user.validation";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // Import untuk menghasilkan UUID
import { signJwt, verifyJwt } from "../../utils/jwt";
const router = express.Router();
 export interface UserData {
    id: string;
    username: string;
    password: string;
    userId: string;
}
export interface ValidationRequest extends Request {
    username: string;
    userData: UserData
}

export const accessValidation = (req: Request, res: Response, next: NextFunction) => {
    const validationReq = req as ValidationRequest;
    const { authorization } = validationReq.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Unauthorized: Access token is missing or invalid'
        });
    }

    const token = authorization.split(' ')[1]; // Mengambil token dari header Authorization

    const jwtVerification = verifyJwt(token);

    if (!jwtVerification.valid) {
        if (jwtVerification.expired) {
            return res.status(401).json({
                message: 'Unauthorized: Token expired'
            });
        } else {
            return res.status(401).json({
                message: 'Unauthorized: Invalid access token'
            });
        }
    }

    if (typeof jwtVerification.decoded !== 'string') {
        validationReq.userData = jwtVerification.decoded as UserData;
    }

    next();
};

router.get("/", async (req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
            }
        });
        logger.info("Get all users success");
        res.json({
            data: result,
            message: 'User list'
        });
    } catch (error) {
        // Log the error
        logger.error(`Error occurred while fetching user list: ${error}`);
        // Respond with an error message
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
            // Menghasilkan UUID atau nanoid
    const id = uuidv4(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid
         // Validate request body
        const { error } = createUserValidation(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await prisma.user.create({
            data: {
                id,
                username,
                password: hashedPassword
            }
        });
        logger.info("User created successfully");
        res.json({
            data: result,
            message: 'User created'
        });
    } catch (error) {
        // Log the error
        console.error(`Error occurred while creating user: ${error}`);
        // Respond with an error message
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
});

router.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = await prisma.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger.info("User updated successfully");
        res.json({
            data: result,
            message: 'User updated'
        });
    } catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const { username } = req.body;
        const result = await prisma.user.update({
            where: { id: userId },
            data: { username: username }
        });
        logger.info("User updated successfully");
        res.json({
            data: result,
            message: 'User updated'
        });
    } catch (error) {
        console.error(`Error occurred while updating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const result = await prisma.user.delete({
            where: { id: userId }
        });
        logger.info("User deleted successfully");
        res.json({
            data: result,
            message: 'User deleted'
        });
    } catch (error) {
        console.error(`Error occurred while deleting user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await prisma.user.findUnique({
            where: {
                username: username,
            }
        });

        // If user is not found, return 404
        if (!user) {
            logger.info("User not found");
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // If user's password is not set, return 404
        if (!user.password) {
            logger.info("Password not set");
            return res.status(404).json({
                message: 'Password not set'
            });
        }

        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // If password is valid, return user data
        if (isPasswordValid) {
            const payload = { 
                id: user.id,
                username: user.username
             };
            // Sign JWT token
            const accessToken = signJwt(payload, { expiresIn: '1h' });
                 // Log successful authentication
            logger.info(`User ${username} authenticated successfully`);
            return res.json({
                data: {
                    id: user.id,
                    name: user.username,
                    
                },
                accessToken: accessToken,
                message: 'User authenticated',
                
            }
        );
        
        } else {
            // If password is invalid, return 403
            logger.info("Wrong password");
            return res.status(403).json({
                message: 'Wrong password'
            });
        }

    } catch (error) {
        console.error(`Error occurred while authenticating user: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/logout", async (req: Request, res: Response) => {
    try {
        // Here, you might want to invalidate the token.
        // Since JWT tokens are stateless, you might need to manage a blacklist of revoked tokens,
        // or you can rely on token expiration to effectively "logout" the user.
        
        // Optionally, you can log the user out from all devices by invalidating all tokens associated with the user.

        res.json({ message: 'Logout successful' });
        logger.info("User logged out successfully");
    } catch (error) {
        logger.error(`Error occurred during logout: ${error}`);
        console.error(`Error occurred during logout: ${error}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
export default router