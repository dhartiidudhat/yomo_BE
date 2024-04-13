const createResponse = async(res: any, status: any, message: any, payload: any) => {
    return await res.status(status).json({
        status: status,
        message: message,
        payload: payload
    });
}
export {
    createResponse
}