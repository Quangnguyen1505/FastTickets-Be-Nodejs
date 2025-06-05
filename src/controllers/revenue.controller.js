const { SuccessResponse } = require("../core/success.response");
const { getAllRevenue, getAllRevenueByEntity, getAllRevenueByDetail } = require("../services/revenue.service");

class RevenueController{

    getAllRevenue = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'get all revenue success',
            metadata: await getAllRevenue(req.query) 
        }).send(res);
    }

    getAllRevenueByEntity = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'get all revenue by entity success',
            metadata: await getAllRevenueByEntity(req.query) 
        }).send(res);
    }

    getAllRevenueByDetail = async ( req, res, next ) => {
        new SuccessResponse({
            message: 'get all revenue by detail success',
            metadata: await getAllRevenueByDetail(req.query) 
        }).send(res);
    }
}

module.exports = new RevenueController();