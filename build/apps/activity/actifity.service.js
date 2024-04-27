"use strict";
// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editActivityById = exports.deleteActivityById = exports.createActivity = exports.getActivityById = exports.getAllActivities = void 0;
const activity_repository_1 = require("./activity.repository");
const activity_validation_1 = require("./activity.validation");
const uuid_1 = require("uuid");
const getAllActivities = () => __awaiter(void 0, void 0, void 0, function* () {
    const activities = yield (0, activity_repository_1.findActifitys)();
    return activities;
});
exports.getAllActivities = getAllActivities;
const getActivityById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield (0, activity_repository_1.findActifitysById)(id);
    if (!activity) {
        throw new Error("Activity not found");
    }
    return activity;
});
exports.getActivityById = getActivityById;
const createActivity = (newActivityData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, activity_validation_1.createActivityValidation)(newActivityData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Menghasilkan UUID atau nanoid
    const id = (0, uuid_1.v4)(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid
    const activity = yield (0, activity_repository_1.insertActivity)(Object.assign(Object.assign({}, newActivityData), { id }));
    return activity;
});
exports.createActivity = createActivity;
const deleteActivityById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield getActivityById(id);
    yield (0, activity_repository_1.deleteActivity)(activity.id);
});
exports.deleteActivityById = deleteActivityById;
const editActivityById = (id, activityData) => __awaiter(void 0, void 0, void 0, function* () {
    yield getActivityById(id);
    const activity = yield (0, activity_repository_1.editActivity)(id, activityData);
    return activity;
});
exports.editActivityById = editActivityById;
//# sourceMappingURL=actifity.service.js.map