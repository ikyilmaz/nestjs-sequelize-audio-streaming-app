import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class UpdateUserDto {
    /**@description email field, optional */
    @ApiProperty({ maxLength: 32, required: false })
    @IsOptional()
    @Length(0, 32, { message: 'field \'firstName\' must be between 0 and 32 characters' })
    @IsString({ message: 'field \'firstName\' must be string' })
    firstName?: string;

    /**@description email field, optional */
    @ApiProperty({ maxLength: 32, required: false })
    @IsOptional()
    @Length(0, 32, { message: 'field \'lastName\' must be between 0 and 32 characters' })
    @IsString({ message: 'field \'lastName\' must be string' })
    lastName?: string;

    /**@description username field, optional */
    @ApiProperty({ required: false, minLength: 2, maxLength: 32, description: 'can only contains a-z 0-9 _' })
    @IsOptional()
    @Matches(/^[a-z0-9_]{2,32}$/, { message: 'field \'username\' must be a valid username' })
    username: string;
}