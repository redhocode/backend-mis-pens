"use strict";
// Layer untuk handle request dan response
// Biasanya juga handle validasi body
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
const scholarship_service_1 = require("./scholarship.service");
const logger_1 = require("../../utils/logger");
const scholarship_validation_1 = require("./scholarship.validation");
const multer_1 = require("../../utils/multer");
const multer_2 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_2.default)({ storage: multer_1.storage });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scholarships = yield (0, scholarship_service_1.getAllScholarships)();
        logger_1.logger.info('Get all scholarships success');
        res.status(200).send(scholarships);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scholarshipId = req.params.id;
        const scholarship = yield (0, scholarship_service_1.getScholarshipById)(scholarshipId);
        logger_1.logger.info(`Get scholarship with id ${scholarshipId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: scholarship });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post('/', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newScholarshipData = req.body;
        // Pastikan userId telah ditetapkan dengan benar
        const userId = req.userId;
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
        newScholarshipData.image = imageUrl;
        const { error } = (0, scholarship_validation_1.createScholarshipValidation)(newScholarshipData);
        if (error) {
            logger_1.logger.error(`Error validating scholarship data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const scholarship = yield (0, scholarship_service_1.createScholarship)(newScholarshipData, userId);
        logger_1.logger.info('Scholarship created successfully');
        res.status(200).send({ status: true, statusCode: 200, data: scholarship });
    }
    catch (error) {
        logger_1.logger.error(`Error creating scholarship: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: 'Internal server error' });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scholarshipId = req.params.id;
        yield (0, scholarship_service_1.deleteScholarshipById)(scholarshipId);
        logger_1.logger.info(`Delete scholarship with id ${scholarshipId} success`);
        res.status(200).send(`Delete scholarship with id ${scholarshipId} success`);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarshipId = req.params.id;
    const scholarshipData = req.body;
    if (!(scholarshipData.image && scholarshipData.description && scholarshipData.title && scholarshipData.date)) {
        logger_1.logger.error('Some fields are missing');
        return res.status(400).send('Some fields are missing');
    }
    try {
        const scholarship = yield (0, scholarship_service_1.editScholarshipById)(scholarshipId, scholarshipData);
        logger_1.logger.info(`Edit scholarship with id ${scholarshipId} success`);
        res.send({
            data: scholarship,
            message: 'edit scholarship success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch('/:id', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const scholarshipId = req.params.id;
        const scholarshipData = req.body;
        const image = req.file;
        if (image) {
            scholarshipData.image = '/uploads/' + image.filename;
        }
        const scholarship = yield (0, scholarship_service_1.editScholarshipById)(scholarshipId, scholarshipData);
        logger_1.logger.info(`Edit scholarship with id ${scholarshipId} success`);
        res.send({
            data: scholarship,
            message: 'edit scholarship success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=scholarship.controller.js.map