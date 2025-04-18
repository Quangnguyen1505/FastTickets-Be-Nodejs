const { SuccessResponse } = require("../core/success.response");
const ShowTimeService = require("../services/showtime.service");

class ShowTimeController {
    async createShowTime(req, res, next) {
        new SuccessResponse({
            message: 'Create showtime success',
            metadata: await ShowTimeService.createShowTime(req.body)
        }).send(res);
    }

    async deleteShowTime(req, res, next) {
        new SuccessResponse({
            message: 'Delete showtime success',
            metadata: await ShowTimeService.deleteShowTime(req.params.showtime_id)
        }).send(res);
    }

    async getTicketShowTime(req, res, next) {
        new SuccessResponse({
            message: 'get ticket showtime success',
            metadata: await ShowTimeService.getTicketPrice(req.params.showtime_id, req.params.seat_type_id)
        }).send(res);
    }

    async getShowTimeById(req, res, next) {
        new SuccessResponse({
            message: 'Delete showtime success',
            metadata: await ShowTimeService.getShowTimeById(req.params.showtime_id)
        }).send(res);
    }

    async getAllShowTimeByMovieId(req, res, next) {
        new SuccessResponse({
            message: 'get all showtime by MovieID success',
            metadata: await ShowTimeService.getAllShowTimeByMovieId(req.params.movie_id)
        }).send(res);
    }

    async getAllShowTime(req, res, next) {
        new SuccessResponse({
            message: 'get all showtime success',
            metadata: await ShowTimeService.getAllShowTime(req.query)
        }).send(res);
    }
}

module.exports = new ShowTimeController();