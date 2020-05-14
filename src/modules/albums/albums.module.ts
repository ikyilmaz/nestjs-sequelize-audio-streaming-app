import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';

@Module({
    controllers: [AlbumsController],
    providers: [AlbumsService],
})
export class AlbumsModule {}
