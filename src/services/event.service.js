const { BadRequestError } = require("../core/error.response");
const db = require('../models');
const { findEventById, findAllEvent } = require("../models/repo/event.repo");

class EventService {
    static async createEvent( payload ) {
        const {
            title, description, event_start, event_end, image, status
        } = payload;

        if(!title || !description || !event_start || !event_end || !image ){
            throw new BadRequestError("Invalid payload");
        }

        if( event_start > event_end ) throw new BadRequestError("Invalid date");

        const newEvent = await db.Event.create({
            title, 
            description, 
            event_start, 
            event_end, 
            image, 
            status 
        });

        if(!newEvent) {
            throw new BadRequestError("Create event failed");
        }

        return newEvent;
    }

    static async getEventById( eventId ) {
        const unselect = ['createdAt', 'updatedAt'];
        const foundEvent = await findEventById(eventId, unselect);
        if(!foundEvent) {
            throw new BadRequestError("Event not found");
        }

        return foundEvent;
    }
    
    static async getAllEvent ({ limit = 10, sort = 'ctime', page = 1 }) {
    
        const foundEvents = await findAllEvent({ limit, sort, page, unselect: ['createdAt', 'updatedAt']});
        if(!foundEvents.length) {
            throw new BadRequestError("Event not found");
        }

        return foundEvents;
    }
}

module.exports = EventService;