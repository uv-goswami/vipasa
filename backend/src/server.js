import express from "express";
import rootRouter from "./routes/index.js";
const app = express();
app.use(express.json());
app.use('/api', rootRouter);
app.listen(3000, () => {
    console.log("App working at http://localhost:3000");
});
