import { Router } from "express";
import { 
    getNews, 
    getNewsById, 
  } from '../../controller/Admin/article/acrticleManagementController';


const router = Router()
router.get('/getArticle', getNews);
router.get('/getArticleById/:id', getNewsById);
export default router
