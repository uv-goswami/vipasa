import { Router } from "express";
import { uploadClientDocument } from "../../controllers/document";
import { uploadProvider } from "../../lib/storageProvider";
import { validateData } from "../../middlewares/validationMiddleware";
import { uploadDocumentSchema } from "../../schema/documentSchema";

const documentRouter = Router();

documentRouter.post(
  "/",
  uploadProvider.single("file"),
  validateData(uploadDocumentSchema),
  uploadClientDocument
);

export default documentRouter;