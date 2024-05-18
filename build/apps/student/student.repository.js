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
            id
        }
    });
    return student;
});
exports.findStudentsById = findStudentsById;
const insertStudent = (studentData, userId, receivedAwardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Mengambil data beasiswa berdasarkan receivedAwardId
        let scholarshipTitle = null;
        // Jika receivedAwardId tidak kosong, ambil data beasiswa
        if (receivedAwardId) {
            const scholarship = yield db_1.default.scholarship.findUnique({
                where: {
                    id: receivedAwardId
                }
            });
            if (!scholarship) {
                throw new Error('Scholarship not found');
            }
            scholarshipTitle = scholarship.title;
        }
        // Mengonversi nilai string menjadi integer di sisi backend
        const parsedYear = parseInt(studentData.year);
        const parsedSemester = parseInt(studentData.semester);
        const student = yield db_1.default.student.create({
            data: {
                nrp: parseInt(studentData.nrp), // Mengonversi nrp dari string menjadi integer
                name: studentData.name,
                major: studentData.major,
                year: parsedYear,
                semester: parsedSemester,
                status: studentData.status,
                ipk: parseFloat(studentData.ipk),
                image: studentData.image,
                userId: userId,
                username: user.username,
                receivedAwardId: receivedAwardId || null,
                receivedAwardName: scholarshipTitle
            }
        });
        return student;
    }
    catch (error) {
        throw new Error(`Error inserting student: ${error.message}`);
    }
});
exports.insertStudent = insertStudent;
const editStudent = (id, studentData, userId, receivedAwardId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        // Mengambil data beasiswa berdasarkan receivedAwardId
        let scholarshipTitle = null;
        // Jika receivedAwardId tidak kosong, ambil data beasiswa
        if (receivedAwardId) {
            const scholarship = yield db_1.default.scholarship.findUnique({
                where: {
                    id: receivedAwardId
                }
            });
            if (!scholarship) {
                throw new Error('Scholarship not found');
            }
            scholarshipTitle = scholarship.title;
        }
        // Mengonversi nilai string menjadi integer di sisi backend
        const parsedYear = parseInt(studentData.year);
        const parsedSemester = parseInt(studentData.semester);
        // Update student data
        const student = yield db_1.default.student.update({
            where: {
                id: id // Ensure to use the id parameter to locate the student
            },
            data: {
                nrp: parseInt(studentData.nrp), // Convert nrp from string to integer
                name: studentData.name,
                major: studentData.major,
                year: parsedYear,
                semester: parsedSemester,
                status: studentData.status,
                ipk: parseFloat(studentData.ipk), // Ensure IPK is a float
                image: studentData.image,
                userId: userId,
                username: user.username,
                receivedAwardId: receivedAwardId || null,
                receivedAwardName: scholarshipTitle
            }
        });
        return student;
    }
    catch (error) {
        throw new Error(`Error updating student: ${error.message}`);
    }
});
exports.editStudent = editStudent;
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield db_1.default.student.delete({
        where: {
            id
        }
    });
});
exports.deleteStudent = deleteStudent;
//# sourceMappingURL=student.repository.js.map