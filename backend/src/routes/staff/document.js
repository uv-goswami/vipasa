import { Router } from "express";
import { uploadDocument } from "../../controllers/document";
import { uploadProvider } from "../../lib/storageProvider";
import { validateData } from "../../middlewares/validationMiddleware";
import { uploadDocumentSchema } from "../../schema/documentSchema";
const documentRouter = Router();
documentRouter.post('/', uploadProvider.single('file'), validateData(uploadDocumentSchema), uploadDocument);
export default documentRouter;
