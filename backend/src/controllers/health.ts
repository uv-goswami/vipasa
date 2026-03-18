import {Request, Response} from "express";

export const checkHealth = async (req: Request, res: Response) => {

    const resp = {
        "status": "OK",
        "message": "VIPASA API is running",
        
    }

    res.status(200).json(resp);
}

export default checkHealth;