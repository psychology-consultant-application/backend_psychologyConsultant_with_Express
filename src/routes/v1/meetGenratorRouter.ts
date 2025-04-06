import { Router } from "express";
import { 
    createAppoinment, 
    getAppoinment, 
    getAppoinmentById,
  } from '../../controller/googleMeet/googleMeetGenerate';


const router = Router()
router.post('/generate-meet-link', createAppoinment);
router.get('/getAppoinmentById/:id', getAppoinmentById);
router.get('/getAppoinment', getAppoinment);
export default router
