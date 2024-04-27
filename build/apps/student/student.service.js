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
exports.editStudentById = exports.deleteStudentById = exports.createStudent = exports.getStudentById = exports.getAllStudents = void 0;
const uuid_1 = require("uuid"); // Import untuk menghasilkan UUID
const student_repository_1 = require("./student.repository");
const student_validation_1 = require("./student.validation");
const getAllStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield (0, student_repository_1.findStudents)();
    return students;
});
exports.getAllStudents = getAllStudents;
const getStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield (0, student_repository_1.findStudentsById)(id);
    return student;
});
exports.getStudentById = getStudentById;
const createStudent = (newStudentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { error, value } = (0, student_validation_1.createStudentValidation)(newStudentData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Menghasilkan UUID atau nanoid
    const id = (0, uuid_1.v4)(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid
    const student = yield (0, student_repository_1.insertStudent)(Object.assign(Object.assign({}, newStudentData), { id }));
    return student;
});
exports.createStudent = createStudent;
const deleteStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, student_repository_1.deleteStudent)(id);
});
exports.deleteStudentById = deleteStudentById;
const editStudentById = (id, studentData) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield (0, student_repository_1.findStudentsById)(id);
    if (!student) {
        throw new Error("Student not found");
    }
    const updatedStudent = yield (0, student_repository_1.editStudent)(id, studentData);
    return updatedStudent;
});
exports.editStudentById = editStudentById;
//# sourceMappingURL=student.service.js.map