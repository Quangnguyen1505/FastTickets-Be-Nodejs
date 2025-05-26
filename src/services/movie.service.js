const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { searchMovie, foundMovieByName, foundMovieById } = require('../models/repo/movie.repo');
const { getCategoryByName } = require('./category.service');
const UploadService = require('./upload.service');
const { DestroyCloudinary } = require('../utils');
const { Op } = require('sequelize');
const { notificationClient } = require('../grpc/client/init.client');
const { producerSendToExchange } = require('../queue/services/sendMailBooking');

class MovieFactory {
    static async createMovie(payload, filePathImg = null) {
        
        const { 
            movie_title, movie_content, movie_time, movie_director, movie_performer, 
            movie_status, movie_country, movie_price, movie_video_trailer_code, movie_category_name,
            movie_release_date, movie_age_rating 
        } = payload;
        
        const result = await db.sequelize.transaction(async (t) => {
            const foundMovie = await foundMovieByName(movie_title);
            if (foundMovie) throw new BadRequestError("Movie already exists");
            
            let hasImage = null;
            if (filePathImg) {
                hasImage = await UploadService.uploadImageFromLocal({ path: filePathImg });
            }
        
            const newMovie = await db.Movie.create({ 
                movie_title, 
                movie_image_url: hasImage?.image_url, 
                movie_video_trailer_code, 
                movie_content, 
                movie_time, 
                movie_director, 
                movie_performer, 
                movie_country, 
                movie_status, 
                movie_price,
                movie_release_date,
                movie_age_rating
            }, { transaction: t });
        
            if (!newMovie) throw new BadRequestError("Create Movie error");
            console.log("movie_category_name", movie_category_name);
            let movieCategoryNameParsed = [];
            try {
                movieCategoryNameParsed = JSON.parse(movie_category_name);
            } catch (error) {
                throw new BadRequestError("Invalid category format");
            }
            
    
            if (movieCategoryNameParsed && Array.isArray(movieCategoryNameParsed) && movieCategoryNameParsed.length > 0) {
                const categoryPromises = movieCategoryNameParsed.map(async (category) => {
                    let foundCate = await getCategoryByName(category.name);
                    if (!foundCate) throw new BadRequestError(`Category "${category.name}" not found`);
    
                    return db.movie_category.create({
                        cate_id: foundCate.id,
                        movie_id: newMovie.id
                    }, { transaction: t });
                });
    
                await Promise.all(categoryPromises);
            }

            const messageNoti = {
                pattern: 'noti_created',
                data: {
                    noti_type: "MOVIE",
                    noti_content: "Rạp vừa ra mắt phim mới, xem ngay !",
                    noti_options: {
                        id: newMovie.id,
                        title: newMovie.movie_title,
                    },
                    noti_senderId: null,
                    noti_receivedId: null
                }
            }
            const nameQueueNoti = 'noti_queue'
            const exchangeNoti = 'noti_exchange'
            const routingkeyNoti = 'noti_created'
            await producerSendToExchange({
                message: messageNoti,
                nameQueue: nameQueueNoti,
                exchange: exchangeNoti,
                routingkey: routingkeyNoti
            })

            return newMovie;
        });
        return result;
    }
    

    static async getMovieById( movieId ) {
        return await db.Movie.findOne({
            where: { id: movieId },
            include: [{
                model: db.movie_category,
                as: 'movie_categories', 
                attributes: ['cate_id'],
                include: [
                    {
                        model: db.category,
                        as: 'category',
                        attributes: ['cate_name'] 
                    }
                ]
            }],
            attributes: {exclude: ['createdAt', 'updatedAt']}
        })
    }

    static async getMovies({ limit = 30, sort = '', page = 1, movie_status = null, category = null, search = '' }) {
        const offset = (page - 1) * limit;
        let order = [];
        if (sort === 'asc') {
            order = [['createdAt', 'ASC']];
        } else if (sort === 'desc') {
            order = [['createdAt', 'DESC']];
        } else {
            order = [['createdAt', 'DESC']]; 
        }
    
        let foundCategory = null;
    
        const whereCondition = {};
        if (movie_status) whereCondition.movie_status = movie_status;

        if (search && search.trim() !== '') {
            whereCondition.movie_title = {
                [Op.iLike]: `%${search.trim()}%`
            };
        }

        if (category) {
            foundCategory = await db.category.findOne({
                where: { cate_name: category },
                attributes: ['id']
            });

            if (!foundCategory) {
                throw new BadRequestError("Category not found");
            }

            whereCondition['$movie_categories.cate_id$'] = foundCategory.id;
        }
    
        return await db.Movie.findAll({
            where: whereCondition,
            limit,
            offset,
            order,
            subQuery: false,
            distinct: true,
            include: [{
                model: db.movie_category,
                as: 'movie_categories',
                attributes: ['cate_id'],
                include: [{
                    model: db.category,
                    as: 'category',
                    attributes: ['cate_name']
                }]
            }]
        });
    }
    

    static async updateMovie(movieId, payload, filePathImg = null) {
        const result = await db.sequelize.transaction(async (t) => {
            const movie = await db.Movie.findOne({ where: { id: movieId }, transaction: t });
            if (!movie) {
                throw new BadRequestError("Movie not found");
            }
        
            const {
                movie_title, movie_content, movie_time, movie_director, movie_performer, 
                movie_status, movie_country, movie_price, movie_video_trailer_code,
                movie_release_date, movie_age_rating, movie_category_name, movie_image_url
            } = payload;
    
            let hasImage = null;
            if (filePathImg) {
                hasImage = await UploadService.uploadImageFromLocal({ path: filePathImg });
            }
        
            await movie.update({
                movie_title, 
                movie_content, 
                movie_time, 
                movie_director, 
                movie_performer, 
                movie_status, 
                movie_country, 
                movie_price, 
                movie_video_trailer_code, 
                movie_release_date, 
                movie_age_rating,
                movie_image_url: hasImage ? hasImage.image_url : movie.movie_image_url
            }, { transaction: t });
        
            if (movie_category_name) {
                let movieCategoryNameParsed = [];
                try {
                    movieCategoryNameParsed = JSON.parse(movie_category_name);
                } catch (error) {
                    throw new BadRequestError("Invalid category format");
                }
                if (!Array.isArray(movieCategoryNameParsed)) {
                    throw new BadRequestError("movie_category_name must be an array");
                }
        
                await db.movie_category.destroy({
                    where: { movie_id: movieId },
                    transaction: t
                });
        
                const categoryPromises = movieCategoryNameParsed.map(async (category) => {
                    const foundCate = await getCategoryByName(category.name);
                    if (!foundCate) {
                        throw new BadRequestError(`Category "${category.name}" not found`);
                    }
        
                    return db.movie_category.create({
                        cate_id: foundCate.id,
                        movie_id: movieId
                    }, { transaction: t });
                });
        
                await Promise.all(categoryPromises);
            }
        
            return await db.Movie.findOne({
                where: { id: movieId },
                include: [{ 
                    model: db.movie_category,
                    as: 'movie_categories',
                    attributes: ['cate_id'],
                    include: [
                        {
                            model: db.category,
                            as: 'category',
                            attributes: ['cate_name']
                        }
                    ]
                }],
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                transaction: t
            });
        });

        return result;
    }
    
    

    static async searchMovie(movie_title) {
        const foundMovie = await searchMovie(movie_title);
        return foundMovie;
    }

    static async deleteMovieById( movieId ) {
        const foundMovie = await foundMovieById({movieId});

        if(!foundMovie) throw new BadRequestError("Movie not found");

        const deleteMovie = await db.Movie.destroy({
            where: { id: movieId }
        });

        if(deleteMovie) {
            const deleteFromCloudinary = async (fileUrl, resourceType) => {
                if (fileUrl) {
                    const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0];
                    await DestroyCloudinary(publicId, resourceType);
                }
            };
            await deleteFromCloudinary(foundMovie.image, 'image');
            await deleteFromCloudinary(foundMovie.video_trailer, 'video');
        }

        return deleteMovie;
    }
}

module.exports = MovieFactory