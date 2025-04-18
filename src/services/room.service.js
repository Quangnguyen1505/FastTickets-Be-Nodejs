const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundRoomById, foundAllRoom, updateMovieToRoom } = require('../models/repo/room.repo');
const { foundMovieById } = require('../models/repo/movie.repo');
const { createSeat } = require('./seat.service');
const { findSeatTypeByName } = require('../models/repo/seat_type.repo');

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
// }


class RoomService{
    static async createRoom(payload) {
        if (!payload) throw new NotFoundError('Variable invalid!!');
        
        const { room_name, room_seat_quantity, room_release_date, room_seat } = payload;
    
        console.log(room_name);
        const foundRoom = await db.Room.findOne({ where: { room_name } });
    
        if (foundRoom) throw new BadRequestError('Room already exists!');
        
        const newRoom = await db.Room.create({
            room_name,
            room_seat_quantity,
            room_release_date
        });
    
        if (!newRoom) throw new BadRequestError('New Room failed!!');
    
        // Đặt các hàng bắt đầu từ A cho ghế normal, D cho ghế vip, và H cho ghế couple
        let row_normal = 'A', row_vip = 'D', row_couple = 'H';
        let seatCountNormal = 0, seatCountVip = 0, seatCountCouple = 0;
        let tempNormal = 1, tempVip = 1, tempCouple = 1;
    
        for (let i = 0; i < room_seat.length; i++) {
            const hasSeatType = await findSeatTypeByName(room_seat[i].type);
            if (!hasSeatType) throw new BadRequestError('Seat type not found');
    
            const new_room_seat_type = await db.Room_seat_type.create({
                room_id: newRoom.id,
                seat_type_id: hasSeatType.id,
                quantity: room_seat[i].quantity
            });
    
            console.log("new_room_seat_type", new_room_seat_type);
    
            for (let j = 0; j < new_room_seat_type.quantity; j++) {
                switch (room_seat[i].type) {
                    case 'normal':
                        await createSeat({
                            seat_number: tempNormal,
                            seat_row: row_normal,
                            seat_type_id: new_room_seat_type.seat_type_id,
                            seat_roomId: newRoom.id
                        });
                        seatCountNormal++;
                        tempNormal++;
    
                        // Sau mỗi 8 ghế, chuyển sang hàng tiếp theo
                        if (seatCountNormal % 8 === 0) {
                            row_normal = String.fromCharCode(row_normal.charCodeAt(0) + 1);
                            tempNormal = 1;
                        }
                        break;
    
                    case 'vip':
                        await createSeat({
                            seat_number: tempVip,
                            seat_row: row_vip,
                            seat_type_id: new_room_seat_type.seat_type_id,
                            seat_roomId: newRoom.id
                        });
                        seatCountVip++;
                        tempVip++;
    
                        // Sau mỗi 8 ghế, chuyển sang hàng tiếp theo
                        if (seatCountVip % 8 === 0) {
                            row_vip = String.fromCharCode(row_vip.charCodeAt(0) + 1);
                            tempVip = 1;
                        }
                        break;
    
                    case 'couple':
                        await createSeat({
                            seat_number: tempCouple,
                            seat_row: row_couple,
                            seat_type_id: new_room_seat_type.seat_type_id,
                            seat_roomId: newRoom.id
                        });
                        seatCountCouple++;
                        tempCouple++;
    
                        // Sau mỗi 5 ghế, chuyển sang hàng tiếp theo
                        if (seatCountCouple % 5 === 0) {
                            row_couple = String.fromCharCode(row_couple.charCodeAt(0) + 1);
                            tempCouple = 1;
                        }
                        break;
    
                    default:
                        break;
                }
            }
        }
    
        return newRoom;
    }    

    static async updateRoom(roomId, payload) {
        if (!roomId || !payload) throw new BadRequestError('Invalid data provided');

        const { room_name, room_seat_quantity, room_release_date, room_seat } = payload;
        
        const foundRoom = await db.Room.findOne({ where: { id: roomId } });
        if (!foundRoom) throw new BadRequestError('Room not found');

        const updatedRoom = await foundRoom.update({
            room_name: room_name || foundRoom.room_name,  
            room_seat_quantity: room_seat_quantity || foundRoom.room_seat_quantity,
            room_release_date: room_release_date || foundRoom.room_release_date
        });

        if (room_seat && room_seat.length > 0) {
            for (let i = 0; i < room_seat.length; i++) {
                const hasSeatType = await findSeatTypeByName(room_seat[i].type);
                if (!hasSeatType) throw new BadRequestError('Seat type not found');

                const existingRoomSeatType = await db.Room_seat_type.findOne({
                    where: { room_id: updatedRoom.id, seat_type_id: hasSeatType.id }
                });

                if (existingRoomSeatType) {
                    await existingRoomSeatType.update({ quantity: room_seat[i].quantity });
                } else {
                    await db.Room_seat_type.create({
                        room_id: updatedRoom.id,
                        seat_type_id: hasSeatType.id,
                        quantity: room_seat[i].quantity
                    });
                }

                let row_vip = 'A', row_normal = 'N', temp = 1, seatCount = 0;
                for (let j = 1; j <= room_seat[i].quantity; j++) {
                    switch (room_seat[i].type) {
                        case 'normal':
                            await createSeat({
                                seat_number: temp,
                                seat_row: row_normal,
                                seat_type_id: hasSeatType.id,
                                seat_roomId: updatedRoom.id
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
                                seat_type_id: hasSeatType.id,
                                seat_roomId: updatedRoom.id
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
                                seat_type_id: hasSeatType.id,
                                seat_roomId: updatedRoom.id
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        return updatedRoom;
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

    static async deleteRoomById(roomId) {
        if (!roomId) throw new BadRequestError('Room ID is required!');
    
        const foundRoom = await db.Room.findOne({ where: { id: roomId } });
        if (!foundRoom) throw new NotFoundError('Room not found!');
    
        await db.Seat.destroy({ where: { seat_roomId: roomId } });
    
        await db.Room_seat_type.destroy({ where: { room_id: roomId } });
    
        await foundRoom.destroy();
    
        return foundRoom
    }
    
}

module.exports = RoomService;