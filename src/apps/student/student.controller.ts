// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response, NextFunction } from "express";
import { getAllStudents, getStudentById, createStudent, deleteStudentById, editStudentById } from "./student.service";
import { logger } from "../../utils/logger";
import { createStudentValidation } from "./student.validation";
import { accessValidation } from "../../middleware/auth";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const students = await getAllStudents();
        logger.info("Get all students success");
        res.status(200).send(students);
    } catch (err:any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const student = await getStudentById(studentId);
        logger.info(`Get student with id ${studentId} success`);
        res.status(200).send(student);
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const newStudentData = req.body;

        // Tambahkan userId ke data mahasiswa sebelum membuatnya
        const userId = req.userId;
        newStudentData.userId = userId;

        const { error } = createStudentValidation(newStudentData);
        if (error) {
            logger.error(`Error validating student data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }

        const student = await createStudent(newStudentData);
        logger.info("Student created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: student });
    } catch (error: any) {
        logger.error(`Error creating student: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
});




router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        await deleteStudentById(studentId);
        logger.info(`Delete student with id ${studentId} success`);
        res.status(200).send(`Delete student with id ${studentId} success`);
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
const studentId: string =req.params.id;
const studentData = req.body;

if(!studentData.name&&studentData.major&&studentData.year&&studentData.semester&&studentData.status){
    logger.error("Some fields are missing");
    return res.status(400).send("Some fields are missing");
}
try {
    const student = await editStudentById(studentId, studentData);
    logger.info(`Edit student with id ${studentId} success`);
    res.send({
        data: student,
        message: "edit student success",
    });
} catch (error: any) {
    logger.error(error);
    res.status(400).send(error.message);
}
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const studentId: string = req.params.id;
        const studentData = req.body;
        const student = await editStudentById(studentId, studentData);
        logger.info(`Edit student with id ${studentId} success`);
        res.send({
            data: student,
            message: "edit student success",
        });
    } catch (error: any) {
        logger.error(error);
        res.status(400).send(error.message);
    }
})


export default router;