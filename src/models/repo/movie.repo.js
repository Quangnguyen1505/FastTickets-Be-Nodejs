const db = require('../../models');

const foundMovieById = async ( movieId ) => {
    const foundMovie = await db.Movie.findOne({
        where: {
            id: movieId
        }
    })

    return foundMovie
}

// const checkMovieByServer = async ( itemMovie, movieId ) => {
//     return Promise.all( itemMovie.map( async (product)=>{
//         const foundMovie = await foundMovieById(movieId);
//         if(foundMovie){
//             return {
//                 price: itemMovie.price,
//                 quantity: product.quantity,
//                 productId: product.productId
//             }
//         }
//     }) )
// }

module.exports = {
    foundMovieById
}