import { Request, Response } from 'express';
import Joi, { string } from "joi";
import { AppDataSource } from '../../data-source';
import fs from 'fs'; // Import modul fs
import sharp from 'sharp'; // Import sharp library
import isBase64 from 'is-base64';
import { meditasi } from '../../model/meditasi';



const { successResponse, errorResponse, validationResponse } = require('../../utils/response')
const meditasiRepository = AppDataSource.getRepository(meditasi)






export const getMeditasi = async (req: Request, res: Response) => {

    try {

        const { limit: queryLimit, page: page, title } = req.query


        const queryBuilder = meditasiRepository.createQueryBuilder('meditasi')
            .orderBy('meditasi.createdAt', 'DESC')




        const dynamicLimit = queryLimit ? parseInt(queryLimit as string) : null;
        const currentPage = page ? parseInt(page as string) : 1; // Convert page to number, default to 1
        const skip = (currentPage - 1) * (dynamicLimit || 0);

        const [data, totalCount] = await queryBuilder
            .skip(skip)
            .take(dynamicLimit || undefined)
            .getManyAndCount();


        res.status(200).json({
            data,
            totalCount,
            currentPage,
            totalPages: Math.ceil(totalCount / (dynamicLimit || 1)),
        })

    } catch (error) {
        res.status(500).json({ msg: error.message })

    }

}


export const getMeditasiById = async (req: Request, res: Response) => {
    try {


        const meditasiID = req.params.id
        const response = await meditasiRepository.find({
            where: {
                id: meditasiID,
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

