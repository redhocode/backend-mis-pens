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
exports.findAcademicById = exports.deleteAcademic = exports.updateAcademic = exports.insertAcademic = exports.findAcademics = void 0;
const db_1 = __importDefault(require("../../db"));
const findAcademics = () => __awaiter(void 0, void 0, void 0, function* () {
    const academics = yield db_1.default.academic.findMany();
    return academics;
});
exports.findAcademics = findAcademics;
const insertAcademic = (academicData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const academic = yield db_1.default.academic.create({
            data: {
                title: academicData.title,
                date: academicData.date,
                description: academicData.description,
                link: academicData.link,
                userId: userId,
                username: user.username
            }
        });
        return academic;
    }
    catch (error) {
        throw new Error(`Error inserting academic: ${error}`);
    }
});
exports.insertAcademic = insertAcademic;
const updateAcademic = (id, academicData) => __awaiter(void 0, void 0, void 0, function* () {
    const academic = yield db_1.default.academic.update({
        where: {
            id
        },
        data: {
            title: academicData.title,
            date: academicData.date,
            description: academicData.description,
            link: academicData.link
        }
    });
    return academic;
});
exports.updateAcademic = updateAcademic;
const deleteAcademic = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const academic = yield db_1.default.academic.delete({
        where: {
            id
        }
    });
    return academic;
});
exports.deleteAcademic = deleteAcademic;
const findAcademicById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const academic = yield db_1.default.academic.findUnique({
        where: {
            id
        }
    });
    return academic;
});
exports.findAcademicById = findAcademicById;
//# sourceMappingURL=academic.repository.js.map