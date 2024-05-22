const { SuccessResponse } = require("../core/success.response");
const eventService = require("../services/event.service");

class EventController{
    createEvent = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Reservation success",
            metadata: await eventService.createEvent(req.body)
        }).send(res);
    }

    getEventById = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get Reservation success",
            metadata: await eventService.getEventById(req.params.id)
        }).send(res);
    }
    
    getAllEvent = async ( req, res, next ) => {
        new SuccessResponse({
            message: "get All Reservation success",
            metadata: await eventService.getAllEvent(req.query)
        }).send(res);
    }
}


module.exports = new EventController();