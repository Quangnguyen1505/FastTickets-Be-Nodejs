const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundRoomById, foundAllRoom, updateMovieToRoom } = require('../models/repo/room.repo');
const { foundMovieById } = require('../models/repo/movie.repo');
const { createSeat } = require('./seat.service');

//
// "cinema_name" : "cinema 1",
// "ciname_seat": [
//     {
//         "name": "normal",
//         "quantity": 10
//     },
//     {
//         "name": "vip",
//         "quantity": 15
//     },
//     {
//         "name": "couple",
//         "quantity": 5
//     }
// ],


class RoomService{
    static async createRoom( payload ){
        if( !payload ) throw new NotFoundError('varible invalid!!');
        const {
            room_name, room_seat, room_status, room_currently_showing ,room_previously_shown = null,
            room_release_date, room_show_times 
        } = payload;

        const foundMovie = await foundMovieById(room_currently_showing);
        for (let i = 0; i < 1; i++) {
            room_seat[0].price = parseInt(foundMovie.price) + 10;
            room_seat[1].price = parseInt(foundMovie.price) + 15;
            room_seat[2].price = parseInt(foundMovie.price) + 25;
        }
        
        const newRoom = await db.Room.create({
            room_name, room_seat, room_status, room_currently_showing ,room_previously_shown,
            room_release_date, room_show_times 
        });
        if(!newRoom) throw new BadRequestError('New Room failed!!');

        await createSeat({ roomId: newRoom.id, seats: newRoom.room_seat });

        return newRoom;
    }

    static async insertMovieToRoom( payload ){
        const { roomId, movieId, release_date } = payload;
        if(!roomId || !movieId) throw new NotFoundError('roomId or movieId invalid!!');

        const foundRoom = await foundRoomById(roomId);
        if(!foundRoom) throw new BadRequestError('Room not exists!');

        const foundMovie = await foundMovieById(movieId);
        if(!foundMovie) throw new BadRequestError('Movie not exists!');

        const dateMovieUsed = new Date(foundRoom.room_release_date).toJSON().slice(0,10);
        const dateMovieNow = new Date(release_date).toJSON().slice(0,10);
        if(dateMovieUsed == dateMovieNow) throw new BadRequestError('Movies currently showing cannot be added!');

        if(foundRoom.room_currently_showing == movieId) throw new BadRequestError('Movie already exists!');

        let movieUsed = [{
            movieId: foundRoom.room_currently_showing,
            Date_Show: foundRoom.room_release_date
        }];

        if(foundRoom.room_previously_shown != null){
            if(foundRoom.room_previously_shown.map(item => item.movieId).includes(movieId)) throw new BadRequestError('Movies cannot be shown again!');
            let previouslyShown = foundRoom.room_previously_shown;
            movieUsed.push(previouslyShown);
            movieUsed = movieUsed.flat();
        }
          
        const newRoom = await updateMovieToRoom(foundRoom.id, movieId, dateMovieNow, movieUsed);

        return newRoom;
    }

    static async getRoomById( roomId ){
        if(!roomId) throw new NotFoundError('seatId invalid!!');

        const foundRoom = await foundRoomById(roomId);
        if(!foundRoom) throw new BadRequestError('Room not exists!');

        return {
            foundRoom
        };
    }

    static async getAllRoom ({ limit = 30, sort = 'ctime', page = 1  }){
        const foundRoom = await foundAllRoom({ limit, sort, page,
            unselect: ['createdAt', 'updatedAt'] });
        if(!foundRoom.length) throw new BadRequestError('Room length not exists!!');

        return foundRoom;
    }
}

module.exports = RoomService;