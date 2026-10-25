export const successResponse =({message="Done",status =200,data=undefined , res})=>{
    res.status(status).json({message,status,data})
}