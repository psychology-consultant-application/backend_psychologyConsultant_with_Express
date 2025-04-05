import { Router } from "express";
import { 
    createAppoinment, 
    getAppoinmentDetails, 
    updateAppoinmentStatus,
    listAppoinments 
  } from '../../controller/googleMeet/googleMeetGenerate';


const router = Router()
router.post('/generate-meet-link', createAppoinment);
router.get('/appoinment/:id', getAppoinmentDetails);
router.patch('/appoinment/:id/status', updateAppoinmentStatus);
router.get('/appoinments', listAppoinments);
export default router
