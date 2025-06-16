import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';

@Controller('room')
export class RoomController {
    @Get(':id')
    getRoom(@Param('id') id: string) {
        // Fetch and return room details by id
        return { id, name: 'Sample Room' };
    }

    @Post()
    createRoom(@Body() createRoomDto: { name: string }) {
        // Create a new room with the provided name
        return { id: 'generated-id', name: createRoomDto.name };
    }

    @Delete(':id')  // TBD: to be added in front 
    deleteRoom(@Param('id') id: string) {
        return { message: `Room with id ${id} deleted` };
    }
}