import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('albums')
@ApiTags("albums")
export class AlbumCommentsController {}
