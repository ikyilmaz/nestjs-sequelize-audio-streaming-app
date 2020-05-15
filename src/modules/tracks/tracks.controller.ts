import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('tracks')
@ApiTags("tracks")
export class TracksController {}
