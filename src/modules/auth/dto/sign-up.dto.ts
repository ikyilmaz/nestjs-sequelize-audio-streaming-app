import { IsNotEmpty, Length, IsAlpha, IsOptional, IsEmail, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
    /**@description email field, optional */
    @ApiProperty({ maxLength: 32, required: false })
    @IsOptional()
    @Length(0, 32, { message: "field 'firstName' must be between 0 and 32 characters" })
    @IsString({ message: "field 'firstName' must be string" })
    firstName?: string;

    /**@description email field, optional */
    @ApiProperty({ maxLength: 32, required: false })
    @IsOptional()
    @Length(0, 32, { message: "field 'lastName' must be between 0 and 32 characters" })
    @IsString({ message: "field 'lastName' must be string" })
    lastName?: string;

    /**@description username field, required */
    @ApiProperty({ required: true, minLength: 2, maxLength: 32, description: 'can only contains a-z 0-9 _' })
    @Matches(/^[a-z0-9_]{2,32}$/, { message: "field 'username' must be a valid username" })
    @IsNotEmpty()
    username: string;

    /**@description email field, required */
    @ApiProperty({ required: true, description: 'must be a valid email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    /**@description password field, required */
    @ApiProperty({ required: true, minLength: 6, maxLength: 32 })
    @Length(6, 32, { message: "field 'password' must be between 0 and 32 charactersF" })
    @IsNotEmpty()
    password: string;

    /**@description passwordConfirm field for checking the password, required */
    @ApiProperty({ required: true, minLength: 6, maxLength: 32 })
    @Length(6, 32, { message: "field 'passwordConfirm' must be between 0 and 32 charactersF" })
    @IsNotEmpty()
    passwordConfirm: string;
}
