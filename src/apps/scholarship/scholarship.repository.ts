import prisma from "../../db";

interface ScholarshipData {
    id:string
title: string;
date: string;
description: string;

     userId: number;
    username?: string;
    link: string;

}

interface Scholarship {
id: string;
title: string;
date: string;
description: string | null;
createdAt: Date;
updatedAt: Date;
    userId: string | null;
    username: string | null;
    link: string | null;
}

const findScholarship = async (): Promise<Scholarship[]> => {
    const scholarships = await prisma.scholarship.findMany();
    return scholarships;
};

const findScholarshipById = async (id: string): Promise<Scholarship | null> => {
    const scholarship = await prisma.scholarship.findUnique({
        where: {
            id,
        },
    });
    return scholarship;
};

const insertScholarship = async (scholarshipData: ScholarshipData): Promise<Scholarship> => {
   
   const scholarship = await prisma.scholarship.create({
       data: {
           title: scholarshipData.title,
           date: scholarshipData.date,
           description: scholarshipData.description,
           
           link: scholarshipData.link,
          
       },
   })
   return scholarship;
};

const editScholarship = async (id: string, scholarshipData: ScholarshipData): Promise<Scholarship> => {
    const scholarship = await prisma.scholarship.update({
        where: {
            id,
        },
        data: {
            title: scholarshipData.title,
            date: scholarshipData.date,
            description: scholarshipData.description,
            
            link: scholarshipData.link,
        },
    });
    return scholarship;
}

const deleteScholarship = async (id: string): Promise<void> => {
    await prisma.scholarship.delete({
        where: {
            id,
        },
    });
}

export {
    findScholarship,
    findScholarshipById,
    insertScholarship,
    deleteScholarship,
    editScholarship,
    ScholarshipData,
    Scholarship
}