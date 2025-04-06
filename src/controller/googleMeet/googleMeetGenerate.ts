import { Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import Joi from "joi";
import { User, UserRole } from "../../model/User";
import { appoinment, StatusAppoinment } from "../../model/appoinment";
import { v4 as uuidv4 } from 'uuid';

const { successResponse, errorResponse, validationResponse } = require('../../utils/response');
const userRepository = AppDataSource.getRepository(User);
const appoinmentRepository = AppDataSource.getRepository(appoinment);

export const createAppoinment = async (req: Request, res: Response) => {
    // Comprehensive validation schema
    const createAppoinmentSchema = Joi.object({
        pasienId: Joi.string().uuid().required(),
        psychologyId: Joi.string().uuid().required(),
        appoinmentDate: Joi.date().iso().min('now').required(),
        durationMinute: Joi.number().min(15).max(120).required(),
        meetLink: Joi.string().uri().required(),
        topikMasalah: Joi.string().optional(),
        deskripsiMasalah: Joi.string().optional()
    });

    try {
        // Validate input
        const { error, value } = createAppoinmentSchema.validate(req.body);
        if (error) {
            return res.status(422).send(validationResponse(error.details));
        }

        const { 
            pasienId, 
            psychologyId, 
            appoinmentDate, 
            durationMinute,
            meetLink,
            topikMasalah,
            deskripsiMasalah
        } = value;

        // Validate participants
        const pasien = await userRepository.findOne({ 
            where: { id: pasienId, role: UserRole.PASIEN } 
        });
        const psychology = await userRepository.findOne({ 
            where: { id: psychologyId, role: UserRole.CONSULTANT } 
        });

        if (!pasien || !psychology) {
            return res.status(404).send(errorResponse('Peserta tidak ditemukan', 404));
        }


        // Calculate start and end times
        const startTime = new Date(appoinmentDate);
        const endTime = new Date(startTime.getTime() + (durationMinute * 60000));

        // Create new appointment entry
        const newAppoinment = appoinmentRepository.create({
            id: uuidv4(),
            pasienId: pasien,
            psychologyId: psychology,
            appoinmentDate: startTime,
            durationMinute: durationMinute,
            meetLink: meetLink,
            topikMasalah: topikMasalah,
            deskripsiMasalah: deskripsiMasalah,
            status: StatusAppoinment.PENDING
        });

        // Save appointment
        await appoinmentRepository.save(newAppoinment);

        return res.status(201).send(successResponse('Buat Appoinment Berhasil', {
            meetLink,
            appoinmentId: newAppoinment.id
        }, 201));

    } catch (error) {
        console.error('Error membuat appoinment:', error);
        return res.status(500).send(errorResponse('Gagal membuat appoinment', 500));
    }
};

export const getAppoinment = async (req: Request, res: Response) => {
    try {
        const { limit: queryLimit, page: page, title } = req.query

        const queryBuilder = appoinmentRepository.createQueryBuilder('appoinment')
            .leftJoinAndSelect('appoinment.pasienId', 'pasien')  // Change alias to 'pasien'
            .leftJoinAndSelect('appoinment.psychologyId', 'psychology')  // Change alias to 'psychology'
            .orderBy('appoinment.createdAt', 'DESC')

        // Optional: Add filtering if needed
        if (title) {
            queryBuilder.andWhere('appoinment.topikMasalah LIKE :title', { title: `%${title}%` })
        }

        const dynamicLimit = queryLimit ? parseInt(queryLimit as string) : 10; // Default limit of 10
        const currentPage = page ? parseInt(page as string) : 1;
        const skip = (currentPage - 1) * dynamicLimit;

        const [data, totalCount] = await queryBuilder
            .skip(skip)
            .take(dynamicLimit)
            .getManyAndCount();

        res.status(200).json({
            data,
            totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / dynamicLimit),
        })

    } catch (error) {
        console.error('Error in getAppoinment:', error);
        res.status(500).json({ 
            msg: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
        })
    }
}



export const getAppoinmentById = async (req: Request, res: Response) => {
    try {


        const newsId = req.params.id
        const response = await appoinmentRepository.find({
            relations : ['pasienId','psychologyId'],
            where: {
                id: newsId,
            },
        });
        console.log(response)

        const news = response[0]
        res.status(200).json(response);



    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}
