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
}

module.exports = new ShowTimeController();