import {Router} from 'express'
import {validateData, validateQuery} from '../../middlewares/validationMiddleware'
import {registerClient} from '../../controllers/auth'
import {getStaffClientById, getStaffClients} from '../../controllers/user'
import {onboardClientSchema} from '../../schema/authSchema'
import {staffClientQuerySchema} from '../../schema/paginationSchema'


const clientRouter:Router = Router();
clientRouter.get('/', validateQuery(staffClientQuerySchema), getStaffClients)
clientRouter.get('/:id', getStaffClientById)
clientRouter.post('/register', validateData(onboardClientSchema), registerClient)


//The below is the Update Profile Route that we will create later on
//clientRouter.patch('/update', )




export default clientRouter;