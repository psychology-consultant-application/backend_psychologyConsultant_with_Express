import { Router } from "express";
import { 
    getJurnal, 
    getJurnalById, 
  } from '../../controller/jurnal/jurnalController';


const router = Router()
router.get('/getJurnal', getJurnal);
router.get('/getJurnalById/:id', getJurnalById);
export default router
