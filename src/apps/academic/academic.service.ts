import { findAcademics, insertAcademic, updateAcademic, deleteAcademic, findAcademicById } from "./academic.repository";
import { AcademicData, Academic } from "./academic.repository";
import { createAcademicValidation } from "./academic.validation";
import { v4 as uuidv4 } from "uuid";


const getAllAcademic = async (): Promise<Academic[]> => {
    const academics = await findAcademics();
    if (!academics) {
        throw new Error("Academic not found");
    }
    return academics;
}
const getAcademicById = async (id: string): Promise<Academic> => {
    const academic = await findAcademicById(id);
    if (!academic) {
        throw new Error("Academic not found");
    }
    return academic;
}
const createAcademic = async (newAcademicData: AcademicData): Promise<Academic> => {
    const { error, value } = createAcademicValidation(newAcademicData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    const id = uuidv4();
    const academic = await insertAcademic({ ...newAcademicData, id });
    return academic;
}

const deleteAcademicById = async (id: string): Promise<void> => {
    const academic = await findAcademicById(id);
    if (!academic) {
        throw new Error("Academic not found");
    }
    await deleteAcademic(id);
}

const editAcademicById = async (id: string, newAcademicData: AcademicData): Promise<Academic> => {
   await findAcademicById(id);
    const academic = await updateAcademic(id, newAcademicData);
    return academic;
}
export {
    getAllAcademic,
    createAcademic,
    deleteAcademicById,
    editAcademicById,
    getAcademicById
}