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
exports.deleteStudent = exports.editStudent = exports.insertStudent = exports.findStudentsById = exports.findStudents = void 0;
const db_1 = __importDefault(require("../../db"));
const findStudents = () => __awaiter(void 0, void 0, void 0, function* () {
    const students = yield db_1.default.student.findMany();
    return students;
});
exports.findStudents = findStudents;
const findStudentsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield db_1.default.student.findUnique({
        where: {
            id,
        },
    });
    return student;
});
exports.findStudentsById = findStudentsById;
const insertStudent = (studentData) => __awaiter(void 0, void 0, void 0, function* () {
    // Pastikan userId ada dalam data mahasiswa
    const student = yield db_1.default.student.create({
        data: {
            nrp: studentData.nrp,
            name: studentData.name,
            major: studentData.major,
            ipk: studentData.ipk,
            year: studentData.year,
            semester: studentData.semester,
            status: studentData.status,
        },
    });
    return student;
});
exports.insertStudent = insertStudent;
const editStudent = (id, studentData) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield db_1.default.student.update({
        where: {
            id,
        },
        data: {
            nrp: studentData.nrp,
            name: studentData.name,
            major: studentData.major,
            year: studentData.year,
            semester: studentData.semester,
            status: studentData.status,
            ipk: studentData.ipk,
        },
    });
    return student;
});
exports.editStudent = editStudent;
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.student.delete({
        where: {
            id,
        },
    });
});
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=student.repository.js.map