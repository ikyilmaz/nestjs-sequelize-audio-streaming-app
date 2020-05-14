import { Controller, Get } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('albums')
export class AlbumsController {
    @ApiOkResponse()
    @ApiNotFoundResponse()
    @Get("/")
    getMany() {
        return {
            "status": "success"
        }
    }
}
