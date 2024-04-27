// Layer untuk handle request dan response
// Biasanya juga handle validasi body

import express, { Request, Response } from "express";
import { getAllActivities, getActivityById, createActivity, deleteActivityById, editActivityById } from "./actifity.service";
import { logger } from "../../utils/logger";
import { createActivityValidation } from "./activity.validation";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const activities = await getAllActivities();
        logger.info("Get all activities success");
        res.status(200).send(activities);
    } catch (err:any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.get("/:id", async (req: Request, res: Response) => {
    try {
        const activityId: string = req.params.id;
        const activity = await getActivityById(activityId);
        logger.info(`Get activity with id ${activityId} success`);
        res.status(200).send({status:true,statusCode:200,data:activity});
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.post("/", async (req: Request, res: Response) => {
    try {
        const newActivityData = req.body;
            const newStudentData = req.body;

        // Tambahkan userId ke data mahasiswa sebelum membuatnya
        const userId = req.userId;
        newStudentData.userId = userId;
        const { error } = createActivityValidation(newActivityData);
        if (error) {
            logger.error(`Error validating activity data: ${error.message}`);
            return res.status(422).send({ status: false, statusCode: 422, message: error.message });
        }
        const activity = await createActivity(newActivityData);
        logger.info("Activity created successfully");
        res.status(200).send({ status: true, statusCode: 200, data: activity });
    } catch (error: any) {
        logger.error(`Error creating activity: ${error.message}`);
        res.status(500).send({ status: false, statusCode: 500, message: "Internal server error" });
    }
});

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        const activityId: string = req.params.id;
        await deleteActivityById(activityId);
        logger.info(`Delete activity with id ${activityId} success`);
        res.status(200).send(`Delete activity with id ${activityId} success`);
    } catch (err: any) {
        logger.error(err);
        res.status(400).send(err.message);
    }
});

router.put("/:id", async (req: Request, res: Response) => {
    const activityId: string = req.params.id;
    const activityData = req.body;

    if (!(activityData.image && activityData.description && activityData.title && activityData.date)) {
        logger.error("Some fields are missing");
        return res.status(400).send("Some fields are missing");
    }
    try {
        const activity = await editActivityById(activityId, activityData);
        logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: "edit activity success",
        });
    } catch (error: any) {
        logger.error(error);
        res.status(400).send(error.message);
    }
});

router.patch("/:id", async (req: Request, res: Response) => {
    try {
        const activityId: string = req.params.id;
        const activityData = req.body;
        const activity = await editActivityById(activityId, activityData);
        logger.info(`Edit activity with id ${activityId} success`);
        res.send({
            data: activity,
            message: "edit activity success",
        });
    } catch (error: any) {
        logger.error(error);
        res.status(400).send(error.message);
    }
});

export default router;