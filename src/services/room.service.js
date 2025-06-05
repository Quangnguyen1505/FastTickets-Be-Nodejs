const { BadRequestError, NotFoundError } = require('../core/error.response');
const db = require('../models');
const { foundRoomById, foundAllRoom, updateMovieToRoom } = require('../models/repo/room.repo');
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
    
        const result = await db.sequelize.transaction(async (t) => {
            const foundRoom = await db.Room.findOne({ where: { room_name }, transaction: t });
    
            if (foundRoom) throw new BadRequestError('Room already exists!');
        
            const newRoom = await db.Room.create({
                room_name,
                room_seat_quantity,
                room_release_date,
                room_status: true,
            }, { transaction: t });
        
            if (!newRoom) throw new BadRequestError('New Room failed!!');
        
            // Cấu hình số ghế mỗi hàng
            const SEAT_PER_ROW_NORMAL = 8;
            const SEAT_PER_ROW_VIP = 8;
            const SEAT_PER_ROW_COUPLE = 8;
        
            // Đếm tổng ghế theo loại
            let totalNormal = 0, totalVip = 0, totalCouple = 0;
        
            for (let i = 0; i < room_seat.length; i++) {
                switch (room_seat[i].type) {
                    case 'normal':
                        totalNormal += room_seat[i].quantity;
                        break;
                    case 'vip':
                        totalVip += room_seat[i].quantity;
                        break;
                    case 'couple':
                        totalCouple += room_seat[i].quantity;
                        break;
                }
            }
        
            // Tính số hàng mỗi loại
            const rowCountNormal = Math.ceil(totalNormal / SEAT_PER_ROW_NORMAL);
            const rowCountVip = Math.ceil(totalVip / SEAT_PER_ROW_VIP);
        
            // Tính hàng bắt đầu cho từng loại
            let row_normal = 'A';
            let row_vip = String.fromCharCode('A'.charCodeAt(0) + rowCountNormal);
            let row_couple = String.fromCharCode(row_vip.charCodeAt(0) + rowCountVip);
        
            // Đếm ghế và vị trí từng loại
            let seatCountNormal = 0, seatCountVip = 0, seatCountCouple = 0;
            let tempNormal = 1, tempVip = 1, tempCouple = 1;
        
            for (let i = 0; i < room_seat.length; i++) {
                const hasSeatType = await findSeatTypeByName({name: room_seat[i].type, t});
                if (!hasSeatType) throw new BadRequestError('Seat type not found');
        
                const new_room_seat_type = await db.Room_seat_type.create({
                    room_id: newRoom.id,
                    seat_type_id: hasSeatType.id,
                    quantity: room_seat[i].quantity
                }, { transaction: t });
        
                console.log("new_room_seat_type", new_room_seat_type);
        
                for (let j = 0; j < new_room_seat_type.quantity; j++) {
                    switch (room_seat[i].type) {
                        case 'normal':
                            await createSeat({
                                seat_number: tempNormal,
                                seat_row: row_normal,
                                seat_type_id: new_room_seat_type.seat_type_id,
                                seat_roomId: newRoom.id
                            }, t);
                            seatCountNormal++;
                            tempNormal++;
        
                            if (seatCountNormal % SEAT_PER_ROW_NORMAL === 0) {
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
                            }, t);
                            seatCountVip++;
                            tempVip++;
        
                            if (seatCountVip % SEAT_PER_ROW_VIP === 0) {
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
                            }, t);
                            seatCountCouple++;
                            tempCouple++;
        
                            if (seatCountCouple % SEAT_PER_ROW_COUPLE === 0) {
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
        });

        return result;
    }    

    static async updateRoom(roomId, payload) {
        if (!roomId || !payload) throw new BadRequestError('Invalid data provided');
    
        const { room_name, room_seat_quantity, room_release_date, room_seat } = payload;
        const result = await db.sequelize.transaction(async (t) => {
            const foundRoom = await db.Room.findOne({ where: { id: roomId }, transaction: t });
            if (!foundRoom) throw new BadRequestError('Room not found');
        
            // Update basic room details
            const updatedRoom = await foundRoom.update({
                room_name: room_name || foundRoom.room_name,  
                room_seat_quantity: room_seat_quantity || foundRoom.room_seat_quantity,
                room_release_date: room_release_date || foundRoom.room_release_date
            }, { transaction: t });
        
            // Update seats if provided
            if (room_seat && room_seat.length > 0) {
                // Remove old seat types if any
                await db.Room_seat_type.destroy({ where: { room_id: updatedRoom.id }, transaction: t });
        
                // Loop through each seat type and update accordingly
                for (let i = 0; i < room_seat.length; i++) {
                    const hasSeatType = await findSeatTypeByName({name: room_seat[i].type, t});
                    if (!hasSeatType) throw new BadRequestError('Seat type not found');
        
                    // Create or update the seat type
                    const newRoomSeatType = await db.Room_seat_type.create({
                        room_id: updatedRoom.id,
                        seat_type_id: hasSeatType.id,
                        quantity: room_seat[i].quantity
                    }, { transaction: t });
        
                    // Seat numbering logic based on seat type
                    let row_normal = 'A', row_vip = 'B', row_couple = 'C', temp = 1, seatCount = 0;
                    for (let j = 0; j < room_seat[i].quantity; j++) {
                        switch (room_seat[i].type) {
                            case 'normal':
                                await createSeat({
                                    seat_number: temp,
                                    seat_row: row_normal,
                                    seat_type_id: newRoomSeatType.seat_type_id,
                                    seat_roomId: updatedRoom.id
                                }, { transaction: t });
                                seatCount++;
                                temp++;
                                if (seatCount % 8 === 0) {  // Adjust this to match SEAT_PER_ROW_NORMAL
                                    row_normal = String.fromCharCode(row_normal.charCodeAt(0) + 1);
                                    temp = 1;
                                }
                                break;
        
                            case 'vip':
                                await createSeat({
                                    seat_number: temp,
                                    seat_row: row_vip,
                                    seat_type_id: newRoomSeatType.seat_type_id,
                                    seat_roomId: updatedRoom.id
                                }, { transaction: t });
                                seatCount++;
                                temp++;
                                if (seatCount % 8 === 0) {  // Adjust this to match SEAT_PER_ROW_VIP
                                    row_vip = String.fromCharCode(row_vip.charCodeAt(0) + 1);
                                    temp = 1;
                                }
                                break;
        
                            case 'couple':
                                await createSeat({
                                    seat_number: temp,
                                    seat_row: row_couple,
                                    seat_type_id: newRoomSeatType.seat_type_id,
                                    seat_roomId: updatedRoom.id
                                }, { transaction: t });
                                seatCount++;
                                temp++;
                                if (seatCount % 8 === 0) {  // Adjust this to match SEAT_PER_ROW_COUPLE
                                    row_couple = String.fromCharCode(row_couple.charCodeAt(0) + 1);
                                    temp = 1;
                                }
                                break;
        
                            default:
                                break;
                        }
                    }
                }
            }
        
            return updatedRoom;
        });
        
        return result;
    }
    

    static async getRoomById( roomId ){
        if(!roomId) throw new NotFoundError('seatId invalid!!');

        const foundRoom = await foundRoomById({roomId});
        if(!foundRoom) throw new BadRequestError('Room not exists!');

        return {
            foundRoom
        };
    }

    static async getAllRoom ({ limit = 30, sort = 'ctime', page = 1  }){
        const foundRoom = await foundAllRoom({ limit, sort, page,
            unselect: ['createdAt', 'updatedAt'] });
        if(!foundRoom) throw new BadRequestError('Room length not exists!!');

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