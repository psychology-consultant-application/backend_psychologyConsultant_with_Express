import { Router } from 'express'
import RouteAuth from './authRouter'
import RouteUserSeeder from './userSeederRoute'
import RouteUserManagementAdmin from './userManagementdminRouter'
import RouteMeetGenerator from './meetGenratorRouter'
import RouteJurnal from './jurnalRoute'
import RouteArticle from './articleRoute'


import { checkJwt } from '../../utils/checkJwt'









const router = Router()

router.use('/auth', RouteAuth)
router.use('/seeder',RouteUserSeeder)
router.use('/userManagementAdmin',RouteUserManagementAdmin)
router.use('/generate-meet',RouteMeetGenerator)
router.use('/jurnal',RouteJurnal)
router.use('/article',RouteArticle)







export default router

