import { Router } from "express";
import { 
    generateMeetLink, 
    getAppoinmentDetails, 
    updateAppoinmentStatus,
    listAppoinments 
  } from '../../controller/googleMeet/googleMeetGenerate';


const router = Router()
router.post('/generate-meet-link', generateMeetLink);
router.get('/appoinment/:id', getAppoinmentDetails);
router.patch('/appoinment/:id/status', updateAppoinmentStatus);
router.get('/appoinments', listAppoinments);
export default router
