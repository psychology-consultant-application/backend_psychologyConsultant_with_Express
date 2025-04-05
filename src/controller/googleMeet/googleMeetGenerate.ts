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
    // Skema validasi input
    const createAppoinmentSchema = (input) => Joi.object({
        pasienId: Joi.string().required(),
        psychologyId: Joi.string().required(),
        appoinmentDate: Joi.date().iso().required(),
        durationMinute: Joi.number().min(15).max(120).required(),
        meetLink: Joi.string().uri().required() // Tambahkan validasi manual meet link
    }).validate(input);

    try {
        // Validasi input
        const schema = createAppoinmentSchema(req.body);
        if ('error' in schema) {
            return res.status(422).send(validationResponse(schema));
        }

        const { 
            pasienId, 
            psychologyId, 
            appoinmentDate, 
            durationMinute,
            meetLink 
        } = req.body;

        // Validasi peserta
        const pasien = await userRepository.findOne({ 
            where: { id: pasienId, role: UserRole.PASIEN } 
        });
        const psychology = await userRepository.findOne({ 
            where: { id: psychologyId, role: UserRole.CONSULTANT } 
        });

        if (!pasien || !psychology) {
            return res.status(404).send(errorResponse('Peserta tidak ditemukan', 404));
        }

        // Hitung waktu mulai dan selesai
        const startTime = new Date(appoinmentDate);
        const endTime = new Date(startTime.getTime() + (durationMinute * 60000));

        // Buat entri appoinment baru
        const newAppoinment = appoinmentRepository.create({
            id: uuidv4(),
            pasienId: pasien,
            psychologyId: psychology,
            appoinmentDate: startTime,
            durationMinute: durationMinute,
            meetLink: meetLink, // Gunakan meet link manual
            status: StatusAppoinment.PENDING
        });

        // Simpan appoinment
        await appoinmentRepository.save(newAppoinment);

        return res.status(200).send(successResponse('Buat Appoinment Berhasil', {
            meetLink,
            appoinmentId: newAppoinment.id
        }, 200));

    } catch (error) {
        console.error('Error membuat appoinment:', error);
        return res.status(500).send(errorResponse('Gagal membuat appoinment', 500));
    }
};

// Fungsi lainnya tetap sama seperti sebelumnya
export const getAppoinmentDetails = async (req: Request, res: Response) => {
    try {
        // Cek otorisasi pengguna
        const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
        if (!userAccess) {
            return res.status(403).send(errorResponse('Unauthorized', 403));
        }

        const { id } = req.params;

        const appoinmentDetails = await appoinmentRepository.findOne({
            where: { id },
            relations: ['pasienId', 'psychologyId']
        });

        if (!appoinmentDetails) {
            return res.status(404).send(errorResponse('Appoinment tidak ditemukan', 404));
        }

        return res.status(200).send(successResponse('Detail Appoinment', { 
            data: appoinmentDetails 
        }, 200));

    } catch (error) {
        console.error('Error getting appoinment details:', error);
        return res.status(500).send(errorResponse('Gagal mengambil detail appoinment', 500));
    }
};

export const updateAppoinmentStatus = async (req: Request, res: Response) => {
    // Skema validasi input status
    const updateStatusSchema = (input) => Joi.object({
        status: Joi.string()
            .valid(...Object.values(StatusAppoinment))
            .required()
    }).validate(input);

    try {
        // Validasi input
        const schema = updateStatusSchema(req.body);
        if ('error' in schema) {
            return res.status(422).send(validationResponse(schema));
        }

        // Cek otorisasi pengguna
        const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
        if (!userAccess || 
            (userAccess.role !== UserRole.ADMIN && 
             userAccess.role !== UserRole.CONSULTANT)) {
            return res.status(403).send(errorResponse('Unauthorized to update appoinment status', 403));
        }

        const { id } = req.params;
        const { status } = req.body;

        const appoinmentToUpdate = await appoinmentRepository.findOne({
            where: { id }
        });

        if (!appoinmentToUpdate) {
            return res.status(404).send(errorResponse('Appoinment tidak ditemukan', 404));
        }

        appoinmentToUpdate.status = status as StatusAppoinment;
        await appoinmentRepository.save(appoinmentToUpdate);

        return res.status(200).send(successResponse('Status Appoinment Berhasil Diupdate', {
            data: appoinmentToUpdate
        }, 200));

    } catch (error) {
        console.error('Error updating appoinment status:', error);
        return res.status(500).send(errorResponse('Gagal update status appoinment', 500));
    }
};

export const listAppoinments = async (req: Request, res: Response) => {
    try {
        const { 
            limit: queryLimit, 
            page, 
            status 
        } = req.query;

        // Cek otorisasi pengguna
        const userAccess = await userRepository.findOneBy({ id: req.jwtPayload.id });
        if (!userAccess) {
            return res.status(403).send(errorResponse('Unauthorized', 403));
        }

        const queryBuilder = appoinmentRepository.createQueryBuilder('appoinment')
            .leftJoinAndSelect('appoinment.pasienId', 'pasien')
            .leftJoinAndSelect('appoinment.psychologyId', 'psychology')
            .orderBy('appoinment.createdAt', 'DESC');

        // Filter berdasarkan status jika diberikan
        if (status) {
            queryBuilder.andWhere('appoinment.status = :status', { status });
        }

        const dynamicLimit = queryLimit ? parseInt(queryLimit as string) : 10;
        const currentPage = page ? parseInt(page as string) : 1;
        const skip = (currentPage - 1) * dynamicLimit;

        const [data, totalCount] = await queryBuilder
            .skip(skip)
            .take(dynamicLimit)
            .getManyAndCount();

        return res.status(200).send(successResponse('Daftar Appoinment', {
            data,
            totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / dynamicLimit)
        }, 200));

    } catch (error) {
        console.error('Error listing appoinments:', error);
        return res.status(500).send(errorResponse('Gagal mengambil daftar appoinment', 500));
    }
};
