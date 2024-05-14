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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAcademicById = exports.editAcademicById = exports.deleteAcademicById = exports.createAcademic = exports.getAllAcademic = void 0;
const academic_repository_1 = require("./academic.repository");
const academic_validation_1 = require("./academic.validation");
const uuid_1 = require("uuid");
const getAllAcademic = () => __awaiter(void 0, void 0, void 0, function* () {
    const academics = yield (0, academic_repository_1.findAcademics)();
    if (!academics) {
        throw new Error('Academic not found');
    }
    return academics;
});
exports.getAllAcademic = getAllAcademic;
const getAcademicById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const academic = yield (0, academic_repository_1.findAcademicById)(id);
    if (!academic) {
        throw new Error('Academic not found');
    }
    return academic;
});
exports.getAcademicById = getAcademicById;
const createAcademic = (newAcademicData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, academic_validation_1.createAcademicValidation)(newAcademicData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const id = (0, uuid_1.v4)();
    const academic = yield (0, academic_repository_1.insertAcademic)(Object.assign(Object.assign({}, newAcademicData), { id }), userId);
    return academic;
});
exports.createAcademic = createAcademic;
const deleteAcademicById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const academic = yield (0, academic_repository_1.findAcademicById)(id);
    if (!academic) {
        throw new Error('Academic not found');
    }
    yield (0, academic_repository_1.deleteAcademic)(id);
});
exports.deleteAcademicById = deleteAcademicById;
const editAcademicById = (id, newAcademicData) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, academic_repository_1.findAcademicById)(id);
    const academic = yield (0, academic_repository_1.updateAcademic)(id, newAcademicData);
    return academic;
});
exports.editAcademicById = editAcademicById;
//# sourceMappingURL=academic.service.js.map