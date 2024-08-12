const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundRoomById, foundAllRoom, updateMovieToRoom } = require('../models/repo/room.repo');
const { foundMovieById } = require('../models/repo/movie.repo');
const { createSeat } = require('./seat.service');

// {
//     "room_name": "Cinema 4", 
//     "room_seat": [
//         {
//             "type": "normal",
//             "quantity": 17,
//         },
//         {
//             "type": "vip",
//             "quantity": 15
//         },
//         {
//             "type": "couple",
//             "quantity": 5,
//         }
//     ], 
//     "room_status": true, 
//     "room_currently_showing": "5292e426-a6a2-4b4b-bfe0-7c2475730b38",
//     "room_release_date": "2024-05-28T00:00:00Z", 
//     "room_show_times": ["2024-05-28T12:10:00Z", "2024-05-28T13:10:00Z"] 
// }


class RoomService{
    static async createRoom( payload ){
        if( !payload ) throw new NotFoundError('varible invalid!!');
        const {
            room_name, room_seat, room_status, room_currently_showing ,room_previously_shown = null,
            room_release_date, room_show_times 
        } = payload;

        const foundRoom = await db.Room.findOne({ where: { room_name } });
        if(foundRoom) throw new BadRequestError('Room already exists!');

        // const foundMovie = await foundMovieById(room_currently_showing);
        // for (let i = 0; i < 1; i++) {
        //     room_seat[0].price = parseInt(foundMovie.price) + 10;
        //     room_seat[1].price = parseInt(foundMovie.price) + 15;
        //     room_seat[2].price = parseInt(foundMovie.price) + 25;
        // }

        const totalSeatQuantity = await room_seat.reduce((acc, item) => {
            return acc + item.quantity
        }, 0);
        
        const newRoom = await db.Room.create({
            room_name, room_seat_quantity: totalSeatQuantity, room_seat_type: room_seat.map(item => item.type), room_status, 
            room_currently_showing ,room_previously_shown, room_release_date, room_show_times 
        });
        
        if(!newRoom) throw new BadRequestError('New Room failed!!');

        // room_seat: {
        //     "quantity": 30,
        //     "type": ["normal", "vip", "couple"],
        // }
        let row_vip = 'A', row_normal = 'N', temp =1;
        let seatCount = 0;
        for (let i = 0; i < room_seat.length; i++) {
            for (let j = 1; j <= room_seat[i].quantity; j++) {
                switch (room_seat[i].type) {
                    case 'normal':
                        await createSeat({
                            seat_number: temp,
                            seat_row: row_normal,
                            seat_type: room_seat[i].type,
                            seat_roomId: newRoom.id 
                        });
                        seatCount++;
                        temp++;
                        if (seatCount % 10 === 0) {
                            row_normal = String.fromCharCode(row_normal.charCodeAt(0) + 1);
                            temp = 1;
                        }
                        break;
                    case 'vip':
                        await createSeat({
                            seat_number: temp,
                            seat_row: row_vip,
                            seat_type: room_seat[i].type,
                            seat_roomId: newRoom.id 
                        });
                        seatCount++;
                        temp++;
                        if (seatCount % 10 === 0) {
                            row_vip = String.fromCharCode(row_vip.charCodeAt(0) + 1);
                            temp = 1;
                        }
                        break;
                    case 'couple':
                        await createSeat({
                            seat_number: j,
                            seat_row: 'E',
                            seat_type: room_seat[i].type,
                            seat_roomId: newRoom.id 
                        });
                        break;
                    default:
                        break;
                }
            }
        }

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