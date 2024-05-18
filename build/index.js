"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const product_controller_1 = __importDefault(require("./apps/product/product.controller"));
const student_controller_1 = __importDefault(require("./apps/student/student.controller"));
const activity_controller_1 = __importDefault(require("./apps/activity/activity.controller"));
const logger_1 = require("./utils/logger");
const body_parser_1 = __importDefault(require("body-parser"));
// import userController from "./apps/user/user.controller";
const deseliarizedToken_1 = __importDefault(require("./middleware/deseliarizedToken"));
// import user, { accessValidation } from './apps/user/user'
const academic_controller_1 = __importDefault(require("./apps/academic/academic.controller"));
const scholarship_controller_1 = __importDefault(require("./apps/scholarship/scholarship.controller"));
const auth_router_1 = require("./apps/user/auth.router");
// Load environment variables based on environment (development or production)
const envFile = process.env.NODE_ENV === 'development' ? '.env.dev' : '.env.prod';
dotenv_1.default.config({ path: envFile });
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static('public'));
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN, // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow these methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Auth-Token', 'Origin'], // Allow these headers
    credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(deseliarizedToken_1.default);
// Set additional CORS headers for preflight requests
app.options('*', (0, cors_1.default)());
app.get('/api', (req, res) => {
    res.send('Hello World! this is backend-mis-pens');
});
app.use('/products', product_controller_1.default);
app.use('/academics', academic_controller_1.default);
app.use(`/students`, student_controller_1.default);
app.use('/users', auth_router_1.AuthRouter);
app.use('/activitys', activity_controller_1.default);
app.use('/scholarships', scholarship_controller_1.default);
app.listen(PORT, () => {
    logger_1.logger.info(`Server running on port: ${PORT}`);
});
//# sourceMappingURL=index.js.map