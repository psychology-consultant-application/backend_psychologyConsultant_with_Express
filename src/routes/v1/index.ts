import { Router } from 'express'
import RouteAuth from './authRouter'
import RouteUserSeeder from './userSeederRoute'
import RouteUserManagementAdmin from './userManagementdminRouter'
import RouteMeetGenerator from './meetGenratorRouter'


import { checkJwt } from '../../utils/checkJwt'









const router = Router()

router.use('/auth', RouteAuth)
router.use('/seeder',RouteUserSeeder)
router.use('/userManagementAdmin',RouteUserManagementAdmin)
router.use('/generate-meet',RouteMeetGenerator)





export default router

