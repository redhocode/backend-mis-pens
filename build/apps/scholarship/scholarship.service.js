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
exports.editScholarshipById = exports.deleteScholarshipById = exports.createScholarship = exports.getScholarshipById = exports.getAllScholarships = void 0;
const scholarship_repository_1 = require("./scholarship.repository");
const scholarship_validation_1 = require("./scholarship.validation");
const uuid_1 = require("uuid");
const getAllScholarships = () => __awaiter(void 0, void 0, void 0, function* () {
    const scholarships = yield (0, scholarship_repository_1.findScholarship)();
    if (!scholarships) {
        throw new Error("Scholarship not found");
    }
    return scholarships;
});
exports.getAllScholarships = getAllScholarships;
const getScholarshipById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarship = yield (0, scholarship_repository_1.findScholarshipById)(id);
    if (!scholarship) {
        throw new Error("Scholarship not found");
    }
    return scholarship;
});
exports.getScholarshipById = getScholarshipById;
const createScholarship = (newScholarshipData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, scholarship_validation_1.createScholarshipValidation)(newScholarshipData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Menghasilkan UUID atau nanoid
    const id = (0, uuid_1.v4)(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid
    const scholarship = yield (0, scholarship_repository_1.insertScholarship)(Object.assign(Object.assign({}, newScholarshipData), { id }));
    return scholarship;
});
exports.createScholarship = createScholarship;
const deleteScholarshipById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const scholarship = yield getScholarshipById(id);
    yield (0, scholarship_repository_1.deleteScholarship)(scholarship.id);
});
exports.deleteScholarshipById = deleteScholarshipById;
const editScholarshipById = (id, newScholarshipData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, scholarship_validation_1.createScholarshipValidation)(newScholarshipData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const scholarship = yield (0, scholarship_repository_1.editScholarship)(id, newScholarshipData);
    return scholarship;
});
exports.editScholarshipById = editScholarshipById;
//# sourceMappingURL=scholarship.service.js.map