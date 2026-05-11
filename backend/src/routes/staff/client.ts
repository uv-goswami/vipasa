import {Router} from 'express'
import {validateData} from '../../middlewares/validationMiddleware'
import {registerClient} from '../../controllers/auth'
import {onboardClientSchema} from '../../schema/authSchema'

const clientRouter:Router = Router();
clientRouter.post('/register', validateData(onboardClientSchema), registerClient)

//The below is the Update Profile Route that we will create later on
//clientRouter.patch('/update', )


export default clientRouter;