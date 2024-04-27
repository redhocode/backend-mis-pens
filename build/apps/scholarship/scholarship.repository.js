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
exports.editScholarship = exports.deleteScholarship = exports.insertScholarship = exports.findScholarshipById = exports.findScholarship = void 0;
const db_1 = __importDefault(require("../../db"));
const findScholarship = () => __awaiter(void 0, void 0, void 0, function* () {
    const scholarships = yield db_1.default.scholarship.findMany();
    return scholarships;
});
exports.findScholarship = findScholarship;
const findScholarshipById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarship = yield db_1.default.scholarship.findUnique({
        where: {
            id,
        },
    });
    return scholarship;
});
exports.findScholarshipById = findScholarshipById;
const insertScholarship = (scholarshipData) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarship = yield db_1.default.scholarship.create({
        data: {
            title: scholarshipData.title,
            date: scholarshipData.date,
            description: scholarshipData.description,
            link: scholarshipData.link,
        },
    });
    return scholarship;
});
exports.insertScholarship = insertScholarship;
const editScholarship = (id, scholarshipData) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarship = yield db_1.default.scholarship.update({
        where: {
            id,
        },
        data: {
            title: scholarshipData.title,
            date: scholarshipData.date,
            description: scholarshipData.description,
            link: scholarshipData.link,
        },
    });
    return scholarship;
});
exports.editScholarship = editScholarship;
const deleteScholarship = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.scholarship.delete({
        where: {
            id,
        },
    });
});
exports.deleteScholarship = deleteScholarship;
//# sourceMappingURL=scholarship.repository.js.map