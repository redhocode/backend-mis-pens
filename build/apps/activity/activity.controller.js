"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const actifity_service_1 = require("./actifity.service");
const logger_1 = require("../../utils/logger");
const multer_1 = require("../../utils/multer");
const multer_2 = __importDefault(require("multer"));
const auth_1 = require("../../middleware/auth");
const router = express_1.default.Router();
const upload = (0, multer_2.default)({ storage: multer_1.storage });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield (0, actifity_service_1.getAllActivities)();
        logger_1.logger.info('Get all activities success');
        res.status(200).send(activities);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityId = req.params.id;
        const activity = yield (0, actifity_service_1.getActivityById)(activityId);
        logger_1.logger.info(`Get activity with id ${activityId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: activity });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post('/', auth_1.requireAdmin || auth_1.requiredUserAdministrasi, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newActivityData = req.body;
        const userId = req.userId; // Ensure userId has been correctly set in the authentication middleware
        if (!userId) {
            return res.status(401).json({ status: false, message: 'Unauthorized' });
        }
        // Check if an image is uploaded
        const image = req.file;
        if (!image) {
            return res.status(400).json({ status: false, message: 'No image uploaded' });
        }
        // Save the image URL to the activity data
        const imageUrl = '/uploads/' + image.filename;
        newActivityData.image = imageUrl;
        // Create a new activity using the service
        const activity = yield (0, actifity_service_1.createActivity)(newActivityData, userId);
        // Send the response with the updated activity data
        return res.status(201).json({ status: true, data: activity });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Internal server error' });
    }
}));
router.delete('/:id', auth_1.requireAdmin || auth_1.requiredUserAdministrasi, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityId = req.params.id;
        yield (0, actifity_service_1.deleteActivityById)(activityId);
        logger_1.logger.info(`Delete activity with id ${activityId} success`);
        res.status(200).send(`Delete activity with id ${activityId} success`);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityId = req.params.id;
    const activityData = req.body;
    if (!(activityData.image && activityData.description && activityData.title && activityData.date)) {
        logger_1.logger.error('Some fields are missing');
        return res.status(400).send('Some fields are missing');
    }
    try {
        const activity = yield (0, actifity_service_1.editActivityById)(activityId, activityData);
        logger_1.logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: 'edit activity success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch('/:id', auth_1.requireAdmin || auth_1.requiredUserAdministrasi, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityId = req.params.id;
        const activityData = req.body;
        // Check if an image is uploaded
        const image = req.file;
        if (image) {
            // Save the updated image URL to the activity data
            activityData.image = '/uploads/' + image.filename;
        }
        const activity = yield (0, actifity_service_1.editActivityById)(activityId, activityData);
        logger_1.logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: 'edit activity success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=activity.controller.js.map