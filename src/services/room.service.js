const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundRoomById, foundAllRoom } = require('../models/repo/room.repo');
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
// movie_playing: [
//     1,2,3,4
// ]

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