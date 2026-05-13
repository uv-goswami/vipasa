export const checkHealth = async (req, res) => {
    const resp = {
        "status": "OK",
        "message": "VIPASA API is running",
    };
    res.status(200).json(resp);
};
export default checkHealth;
