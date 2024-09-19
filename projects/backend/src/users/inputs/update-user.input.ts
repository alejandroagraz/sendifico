import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../common/constants/gender.constant';
import { StatusUser } from '../../common/constants/status-user.constant';

export class UpdateUserInput {
  @ApiProperty({ example: 'Leonel', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Messi', required: false })
  @IsOptional()
  @IsString()
  lastname?: string;

  @ApiProperty({ example: '12345678', required: false, type: String })
  @IsOptional()
  @IsNumberString()
  dni?: number;

  @ApiProperty({ example: 'goat10', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    description: 'Gender',
    enum: Gender,
    type: Gender,
    example: Gender.MAN,
    required: false,
  })
  @IsOptional()
  gender?: Gender;

  @ApiProperty({
    description: 'Status User',
    enum: StatusUser,
    type: StatusUser,
    example: StatusUser.INACTIVE,
    required: false,
  })
  @IsOptional()
  status?: StatusUser;

  @ApiProperty({ example: '123 1234567', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'Cra. 87 #30-65, Medellín, Antioquia, Colombia',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'goat10@email.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;
}
