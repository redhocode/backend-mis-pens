import prisma from "../../db";

interface Activity{
    id: string;
    title: string;
    date: string| null;
    description: string | null;
    link: string | null;
    createdAt: Date;
    updatedAt: Date;
    userId: string | null;
    username: string | null; // Menyimpan username pengguna// Tambahkan field username
}

interface ActivityData{
    id: string;
    title: string;
    date: string;
    description: string;
    link: string;
     userId: string;
    username?: string;
}

const findActifitys = async (): Promise<Activity[]> => {
    const activities = await prisma.activity.findMany();
    return activities;
};

const findActifitysById = async (id: string): Promise<Activity | null> => {
    const activity = await prisma.activity.findUnique({
        where: {
            id,
        },
    });
    return activity;
};

const insertActivity = async (activityData: ActivityData): Promise<Activity> => {
//    const user = await prisma.user.findUnique({
//        where: {
//            id: activityData.userId,
//        },
//    })
   const activity = await prisma.activity.create({
       data: {
           title: activityData.title,
           date: activityData.date,
           description: activityData.description,
        
           link: activityData.link,
           userId: activityData.userId,
        //    username: user?.username,
       },
   })
   return activity;
};

const editActivity = async (id: string, activityData: ActivityData): Promise<Activity> => {
    const activity = await prisma.activity.update({
        where: {
            id,
        },
        data: {
            title: activityData.title,
            date: activityData.date,
            description: activityData.description,
            link: activityData.link,
            
        },
    });
    return activity;
};

const deleteActivity = async (id: string): Promise<void> => {
    await prisma.activity.delete({
        where: {
            id,
        },
    });
}

export {
    findActifitys,
    findActifitysById,
    insertActivity,
    editActivity,
    deleteActivity,
    Activity,
    ActivityData
}