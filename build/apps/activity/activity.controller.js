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
const actifity_service_1 = require("./actifity.service");
const logger_1 = require("../../utils/logger");
const activity_validation_1 = require("./activity.validation");
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activities = yield (0, actifity_service_1.getAllActivities)();
        logger_1.logger.info("Get all activities success");
        res.status(200).send(activities);
    }
    catch (err) {
        logger_1.logger.error(err);
        res.status(400).send(err.message);
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newActivityData = req.body;
        const newStudentData = req.body;
        // Tambahkan userId ke data mahasiswa sebelum membuatnya
        const userId = req.userId;
        newStudentData.userId = userId;
        const { error } = (0, activity_validation_1.createActivityValidation)(newActivityData);
        if (error) {
            logger_1.logger.error(`Error validating activity data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const activity = yield (0, actifity_service_1.createActivity)(newActivityData);
        logger_1.logger.info("Activity created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: activity });
    }
    catch (error) {
        logger_1.logger.error(`Error creating activity: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityId = req.params.id;
    const activityData = req.body;
    if (!(activityData.image && activityData.description && activityData.title && activityData.date)) {
        logger_1.logger.error("Some fields are missing");
        return res.status(400).send("Some fields are missing");
    }
    try {
        const activity = yield (0, actifity_service_1.editActivityById)(activityId, activityData);
        logger_1.logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: "edit activity success",
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
router.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const activityId = req.params.id;
        const activityData = req.body;
        const activity = yield (0, actifity_service_1.editActivityById)(activityId, activityData);
        logger_1.logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: "edit activity success",
        });
    }
    catch (error) {
        logger_1.logger.error(error);
        res.status(400).send(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=activity.controller.js.map