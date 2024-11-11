const { BadRequestError } = require('../core/error.response');
const db = require('../models');
const { searchMovie, foundMovieByName, foundMovieById } = require('../models/repo/movie.repo');
const { getCategoryByName } = require('./category.service');
const UploadService = require('./upload.service');
const { DestroyCloudinary } = require('../utils');

class MovieFactory {
    static async createMovie( payload, filePathImg = null, filePathVideo = null ) {
        const { 
            title, content, time, director, performer, 
            movie_categoryId, movie_status, country, price 
        } = payload;
        
        const foundMovie = await foundMovieByName(title);
        if(foundMovie) throw new BadRequestError("Movie already exists");
        
        let hasImage = null, hasVideo = null;
        if(filePathImg) {
            hasImage = await UploadService.uploadImageFromLocal({path: filePathImg.path});
        }
        if(filePathVideo) {
            hasVideo = await UploadService.uploadTrailer({path: filePathVideo.path});
        }
        const newMovie = await db.Movie.create({ 
            title, image: hasImage?.image_url, video_trailer: hasVideo?.video_url, content, time, director, 
            performer, movie_categoryId, movie_status, country, price 
        });

        if(!newMovie) throw new BadRequestError("create Movie error");

        return newMovie;
    }

    static async getMovieById( movieId ) {
        return await db.Movie.findOne({
            where: { id: movieId },
            include: [{
                model: db.category,
                as: 'category', 
                attributes: ['cate_name']
            }],
            attributes: {exclude: ['createdAt', 'updatedAt']}
        })
    }

    static async getMovies({ limit = 30, sort = 'ctime', page = 1, movie_status = null, category = null }) {
        const skip = ( page - 1 ) * limit;
        const sortBy = sort == 'ctime' ? {_id: -1} : {_id: 1};
        let foundCategory
        if(category) {
            foundCategory = await getCategoryByName(category);
            if(!foundCategory) throw new BadRequestError("Category not found");
        }
        const whereCondition = movie_status ? { movie_status } : { movie_categoryId: foundCategory.id };
        return await db.Movie.findAll({
            where: whereCondition,
            limit,
            sort: sortBy,
            skip,
            include: category ? [{
                model: db.category,
                as: 'category', 
                attributes: ['cate_name']
            }] : []
        });
    }

    static async updateMovie( movieId, payload ) {
        console.log("payload", movieId);
        const movie = await db.Movie.findOne({
            where: { id: movieId }
        });

        if(!movie) throw new BadRequestError("Movie not found");

        const updateMovie = await db.Movie.update(payload, {
            where: { id: movieId }
        });

        return updateMovie;
    }

    static async searchMovie(movie_title) {
        const foundMovie = await searchMovie(movie_title);
        return foundMovie;
    }

    static async deleteMovieById( movieId ) {
        const foundMovie = await foundMovieById(movieId);

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