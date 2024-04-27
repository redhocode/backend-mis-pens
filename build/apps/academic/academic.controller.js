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
const academic_service_1 = require("./academic.service");
const logger_1 = require("../../utils/logger");
const academic_validation_1 = require("./academic.validation");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academic = yield (0, academic_service_1.getAllAcademic)();
        logger_1.logger.info("Get all academic success");
        res.status(200).send(academic);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicId = req.params.id;
        const academic = yield (0, academic_service_1.getAcademicById)(academicId);
        logger_1.logger.info(`Get academic with id ${academicId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: academic });
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newAcademicData = req.body;
        const newStudentData = req.body;
        const userId = req.userId;
        newStudentData.userId = userId;
        const { error } = (0, academic_validation_1.createAcademicValidation)(newAcademicData);
        if (error) {
            logger_1.logger.error(`Error validating academic data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const academic = yield (0, academic_service_1.createAcademic)(newAcademicData);
        logger_1.logger.info("Academic created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: academic });
    }
    catch (error) {
        logger_1.logger.error(`Error creating academic: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicId = req.params.id;
        yield (0, academic_service_1.deleteAcademicById)(academicId);
        logger_1.logger.info(`Delete academic with id ${academicId} success`);
        res.status(200).send(`Delete academic with id ${academicId} success`);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicId = req.params.id;
        const newAcademicData = req.body;
        const { error } = (0, academic_validation_1.createAcademicValidation)(newAcademicData);
        if (error) {
            logger_1.logger.error(`Error validating academic data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const academic = yield (0, academic_service_1.editAcademicById)(academicId, newAcademicData);
        logger_1.logger.info(`Edit academic with id ${academicId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: academic });
    }
    catch (error) {
        logger_1.logger.error(`Error editing academic: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const academicId = req.params.id;
        const newAcademicData = req.body;
        const { error } = (0, academic_validation_1.createAcademicValidation)(newAcademicData);
        if (error) {
            logger_1.logger.error(`Error validating academic data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const academic = yield (0, academic_service_1.editAcademicById)(academicId, newAcademicData);
        logger_1.logger.info(`Edit academic with id ${academicId} success`);
        res.status(200).send({ status: true, statusCode: 200, data: academic });
    }
    catch (error) {
        logger_1.logger.error(`Error editing academic: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
}));
exports.default = router;
//# sourceMappingURL=academic.controller.js.map