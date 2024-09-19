import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from '../../common/constants/gender.constant';
import { Transform } from 'class-transformer';
import { StatusUser } from '../../common/constants/status-user.constant';

export class CreateUserInput {
  @ApiProperty({ example: 'Leonel', required: true })
  @IsNotEmpty({ message: 'The name is required' })
  @MinLength(3, {
    message: 'Length error for name min 3',
  })
  // @NotContains(" ", {message: 'Error spaces'})
  @Transform(({ value }) => value?.trim())
  @IsString()
  name: string;

  @ApiProperty({ example: 'Messi', required: true })
  @IsNotEmpty({ message: 'The lastname is required' })
  @IsString()
  lastname: string;

  @ApiProperty({ example: '12345678', type: String })
  @IsNotEmpty({ message: 'The dni is required' })
  @IsNumberString()
  @Length(8, 10, {
    message: 'Length error for dni min 8 and max 10',
  })
  dni: number;

  @ApiProperty({ example: 'goat10', required: true })
  @IsNotEmpty({ message: 'The username is required' })
  @MinLength(3, {
    message: 'Length error for username min 3',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    type: Gender,
    example: Gender.MAN,
    required: true,
  })
  @IsNotEmpty({ message: 'The gender is required' })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Status User',
    enum: StatusUser,
    type: StatusUser,
    example: StatusUser.INACTIVE,
    required: true,
  })
  @IsNotEmpty({ message: 'The status is required' })
  @IsEnum(StatusUser)
  status: StatusUser;

  @ApiProperty({ example: '123 1234567', required: true })
  @IsNotEmpty({ message: 'The phone is required' })
  @MinLength(7, {
    message: 'Length error for phone min 7',
  })
  @IsString({ message: 'Format error for phone' })
  phone: string;

  @ApiProperty({
    example: 'Cra. 87 #30-65, Medellín, Antioquia, Colombia',
    required: true,
  })
  @IsNotEmpty({ message: 'The address is required' })
  @MinLength(7, {
    message: 'Length error for address min 7',
  })
  @Transform(({ value }) => value?.trim())
  @IsString()
  address: string;

  @ApiProperty({ example: 'goat10@email.com', required: true })
  @IsNotEmpty({ message: 'The email is required' })
  @IsEmail()
  @MinLength(6, {
    message: 'Length error for email min 6',
  })
  @MaxLength(50, {
    message: 'Length email for email max 50',
  })
  email: string;

  @ApiProperty({
    description: 'Password',
    example:
      'At least 1 upper case letter, 1 lower case letter, 1 number or special character and min length 8 character.',
  })
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  @MinLength(8, {
    message: 'Length error for password min 8',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'At least 1 upper case letter, 1 lower case letter, 1 number or special character and min length 8 character.',
  })
  password: string;
}
