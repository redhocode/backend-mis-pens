// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response } from "express";
import { getAllScholarships, getScholarshipById, createScholarship, deleteScholarshipById, editScholarshipById } from "./scholarship.service";
import { logger } from "../../utils/logger";
import { createScholarshipValidation } from "./scholarship.validation";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const scholarships = await getAllScholarships();
        logger.info("Get all scholarships success");
        res.status(200).send(scholarships);
    } catch (err:any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const scholarshipId: string = req.params.id;
        const scholarship = await getScholarshipById(scholarshipId);
        logger.info(`Get scholarship with id ${scholarshipId} success`);
        res.status(200).send({status:true,statusCode:200,data:scholarship});
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const newScholarshipData = req.body;
                  const newStudentData = req.body;

        // Tambahkan userId ke data mahasiswa sebelum membuatnya
        const userId = req.userId;
        newStudentData.userId = userId;
        const { error } = createScholarshipValidation(newScholarshipData);
        if (error) {
            logger.error(`Error validating scholarship data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const scholarship = await createScholarship(newScholarshipData);
        logger.info("Scholarship created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: scholarship });
    } catch (error: any) {
        logger.error(`Error creating scholarship: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const scholarshipId: string = req.params.id;
        await deleteScholarshipById(scholarshipId);
        logger.info(`Delete scholarship with id ${scholarshipId} success`);
        res.status(200).send(`Delete scholarship with id ${scholarshipId} success`);
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const scholarshipId: string = req.params.id;
    const scholarshipData = req.body;
    if(!(scholarshipData.image && scholarshipData.description && scholarshipData.title && scholarshipData.date)) {
        logger.error("Some fields are missing");
        return res.status(400).send("Some fields are missing");
}
try{
    const scholarship = await editScholarshipById(scholarshipId, scholarshipData);
    logger.info(`Edit scholarship with id ${scholarshipId} success`);
    res.send({
        data: scholarship,
        message: "edit scholarship success",
    }); 
} catch (error: any) {
    logger.error(error);
    res.status(400).send(error.message);
}
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const scholarshipId: string = req.params.id;
        const scholarshipData = req.body;
        const scholarship = await editScholarshipById(scholarshipId, scholarshipData);
        logger.info(`Edit scholarship with id ${scholarshipId} success`);
        res.send({
            data: scholarship,
            message: "edit scholarship success",
        });
    } catch (error: any) {
        logger.error(error);
        res.status(400).send(error.message);
    }
});

export default router;