import { PartialType } from '@nestjs/swagger';
import { CreateClaseDto } from './create-clase.dto.js';

export class UpdateClaseDto extends PartialType(CreateClaseDto) {}
