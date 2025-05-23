import { Request, Response } from 'express';
import Joi, { string } from "joi";
import { AppDataSource } from '../../../data-source';
import fs from 'fs'; // Import modul fs
import sharp from 'sharp'; // Import sharp library
import { User } from '../../../model/User';
import { Article } from '../../../model/article';
import isBase64 from 'is-base64';



const { successResponse, errorResponse, validationResponse } = require('../../../utils/response')
const ArticleRepository = AppDataSource.getRepository(Article)
const userRepository = AppDataSource.getRepository(User)






export const getNews = async (req: Request, res: Response) => {

    try {

        const { limit: queryLimit, page: page, title } = req.query


        const queryBuilder = ArticleRepository.createQueryBuilder('news')
            .leftJoinAndSelect('news.updatedBy', 'user')
            .orderBy('news.createdAt', 'DESC')



        if (title) {
            queryBuilder.where('news.title LIKE :title', {
                title: `%${title}%`
            })

        }

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


export const getNewsById = async (req: Request, res: Response) => {
    try {


        const newsId = req.params.id
        const response = await ArticleRepository.find({
            relations : ['updatedBy'],
            where: {
                id: newsId,
            },
        });
        console.log(response)

        const news = response[0]
        const imagePath = news.image;
        res.status(200).json(response);



    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message })
    }
}

