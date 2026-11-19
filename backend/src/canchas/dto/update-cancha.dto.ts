import { PartialType } from '@nestjs/swagger';
import { CreateCanchaDto } from './create-cancha.dto.js';

export class UpdateCanchaDto extends PartialType(CreateCanchaDto) {}
