// Service layer bertujuan untuk handle business logic
// Kenapa dipisah? Supaya tanggung jawabnya ter-isolate, dan functions-nya

import { findActifitys, findActifitysById, insertActivity, deleteActivity, editActivity } from "./activity.repository";
import { ActivityData, Activity } from "./activity.repository";
import { createActivityValidation } from "./activity.validation";
import { v4 as uuidv4 } from "uuid";
const getAllActivities = async (): Promise<Activity[]> => {
    const activities = await findActifitys();
    return activities;
};

const getActivityById = async (id: string): Promise<Activity | null> => {
    const activity = await findActifitysById(id);
    if (!activity) {
        throw new Error("Activity not found");
    }
    return activity;
};

const createActivity = async (newActivityData: ActivityData): Promise<Activity> => {
    const { error, value } = createActivityValidation(newActivityData);
    if (error) {
        throw new Error(error.details[0].message);
    }
    // Menghasilkan UUID atau nanoid
    const id = uuidv4(); // Menggunakan UUID
    // const id = nanoid(); // Menggunakan nanoid
    const activity = await insertActivity({ ...newActivityData, id });
    return activity;
};

const deleteActivityById = async (id: string): Promise<void> => {
  const activity = await getActivityById(id);
  await deleteActivity(activity!.id);
}

const editActivityById = async (id: string, activityData: ActivityData): Promise<Activity> => {
  await getActivityById(id);
  const activity = await editActivity(id, activityData);
  return activity;
};

export {
    getAllActivities,
    getActivityById,
    createActivity,
    deleteActivityById,
    editActivityById
}
