import { Router } from "express";
import { 
    getMeditasi, 
    getMeditasiById, 
  } from '../../controller/meditasi/meditasiController';


const router = Router()
router.get('/getMeditasi', getMeditasi);
router.get('/getMeditasiById/:id', getMeditasiById);
export default router
