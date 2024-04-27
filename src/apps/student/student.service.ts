import { v4 as uuidv4 } from 'uuid'; // Import untuk menghasilkan UUID
import { nanoid } from 'nanoid'; // Import untuk menghasilkan nanoid
import { findStudents, findStudentsById, insertStudent, deleteStudent, editStudent } from "./student.repository";
import { StudentData, Student } from "./student.repository";
import { createStudentValidation } from "./student.validation";

const getAllStudents = async (): Promise<Student[]> => {
    const students = await findStudents();
    return students;
};

const getStudentById = async (id: string): Promise<Student | null> => { // Menggunakan tipe data string untuk UUID atau nanoid
    const student = await findStudentsById(id);
    return student;
};

const createStudent = async (newStudentData: StudentData): Promise<Student> => {
    const { error, value } = createStudentValidation(newStudentData);
    if (error) {
        throw new Error(error.details[0].message);
    }

    // Menghasilkan UUID atau nanoid
    const id = uuidv4(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid

    const student = await insertStudent({ ...newStudentData, id });
    return student;
};

const deleteStudentById = async (id: string): Promise<void> => { // Menggunakan tipe data string untuk UUID atau nanoid
    await deleteStudent(id);
};

const editStudentById = async (id: string, studentData: StudentData): Promise<Student> => { // Menggunakan tipe data string untuk UUID atau nanoid
    const student = await findStudentsById(id);
    if (!student) {
        throw new Error("Student not found");
    }
    const updatedStudent = await editStudent(id, studentData);
    return updatedStudent;
}

export {
    getAllStudents,
    getStudentById,
    createStudent,
    deleteStudentById,
    editStudentById
}
