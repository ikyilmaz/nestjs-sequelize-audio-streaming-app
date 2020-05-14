import { IsNotEmpty, Length, IsAlpha, IsOptional, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUpDto {
  @ApiProperty({ required: true })
  @IsOptional()
  @Length(2, 32)
  @IsAlpha("tr")
  firstName?: string;

  @ApiProperty({ required: false})
  @IsOptional()
  @Length(2, 32)
  @IsAlpha("tr")
  lastName?: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsAlpha()
  @Length(2, 64)
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(6, 32)
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  passwordConfirm?: string;
}