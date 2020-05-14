import { IsNotEmpty, IsAlpha, Length, IsEmail, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignInDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsAlpha()
  @Length(2, 64)
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;
}