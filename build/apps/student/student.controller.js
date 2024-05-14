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
const student_service_1 = require("./student.service");
const logger_1 = require("../../utils/logger");
const student_validation_1 = require("./student.validation");
const auth_1 = require("../../middleware/auth");
const multer_1 = require("../../utils/multer");
const multer_2 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_2.default)({ storage: multer_1.storage });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield (0, student_service_1.getAllStudents)();
        logger_1.logger.info('Get all students success');
        res.status(200).send(students);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get('/:id', auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        const student = yield (0, student_service_1.getStudentById)(studentId);
        logger_1.logger.info(`Get student with id ${studentId} success`);
        res.status(200).send(student);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post('/', auth_1.requireAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newStudentData = req.body;
        // Pastikan userId telah ditetapkan dengan benar
        const userId = req.userId;
        if (!userId) {
            throw new Error('User ID is not valid.');
        }
        const image = req.file;
        if (!image) {
            throw new Error('Image is not valid.');
        }
        const imageUrl = '/uploads/' + image.filename;
        newStudentData.image = imageUrl;
        const { error } = (0, student_validation_1.createStudentValidation)(newStudentData);
        if (error) {
            logger_1.logger.error(`Error validating student data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const student = yield (0, student_service_1.createStudent)(newStudentData, userId);
        logger_1.logger.info('Student created successfully');
        res.status(200).send({ status: true, statusCode: 200, data: student });
    }
    catch (error) {
        logger_1.logger.error(`Error creating student: ${error.message}`);
        res.status(400).send({ status: false, statusCode: 400, message: error.message });
    }
}));
router.delete('/:id', auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        yield (0, student_service_1.deleteStudentById)(studentId);
        logger_1.logger.info(`Delete student with id ${studentId} success`);
        res.status(200).send(`Delete student with id ${studentId} success`);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.put('/:id', auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = req.params.id;
    const studentData = req.body;
    if (!studentData.name && studentData.major && studentData.year && studentData.semester && studentData.status) {
        logger_1.logger.error('Some fields are missing');
        return res.status(400).send('Some fields are missing');
    }
    try {
        const student = yield (0, student_service_1.editStudentById)(studentId, studentData);
        logger_1.logger.info(`Edit student with id ${studentId} success`);
        res.send({
            data: student,
            message: 'edit student success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch('/:id', auth_1.requireAdmin, upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        const studentData = req.body;
        const image = req.file;
        if (image) {
            studentData.image = '/uploads/' + image.filename;
        }
        const student = yield (0, student_service_1.editStudentById)(studentId, studentData);
        logger_1.logger.info(`Edit student with id ${studentId} success`);
        res.send({
            data: student,
            message: 'edit student success'
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=student.controller.js.map