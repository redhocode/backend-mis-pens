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
exports.deleteActivity = exports.editActivity = exports.insertActivity = exports.findActifitysById = exports.findActifitys = void 0;
const db_1 = __importDefault(require("../../db"));
const findActifitys = () => __awaiter(void 0, void 0, void 0, function* () {
    const activities = yield db_1.default.activity.findMany();
    return activities;
});
exports.findActifitys = findActifitys;
const findActifitysById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield db_1.default.activity.findUnique({
        where: {
            id,
        },
    });
    return activity;
});
exports.findActifitysById = findActifitysById;
const insertActivity = (activityData) => __awaiter(void 0, void 0, void 0, function* () {
    //    const user = await prisma.user.findUnique({
    //        where: {
    //            id: activityData.userId,
    //        },
    //    })
    const activity = yield db_1.default.activity.create({
        data: {
            title: activityData.title,
            date: activityData.date,
            description: activityData.description,
            link: activityData.link,
            userId: activityData.userId,
            //    username: user?.username,
        },
    });
    return activity;
});
exports.insertActivity = insertActivity;
const editActivity = (id, activityData) => __awaiter(void 0, void 0, void 0, function* () {
    const activity = yield db_1.default.activity.update({
        where: {
            id,
        },
        data: {
            title: activityData.title,
            date: activityData.date,
            description: activityData.description,
            link: activityData.link,
        },
    });
    return activity;
});
exports.editActivity = editActivity;
const deleteActivity = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.activity.delete({
        where: {
            id,
        },
    });
});
exports.deleteActivity = deleteActivity;
//# sourceMappingURL=activity.repository.js.map