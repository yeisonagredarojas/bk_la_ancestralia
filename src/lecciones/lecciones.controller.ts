import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeccionesService } from './lecciones.service';
import { CreateLeccionDto } from '../dto/create-leccion.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('lecciones')
export class LeccionesController {
  constructor(private leccionesService: LeccionesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  create(@Body() createLeccionDto: CreateLeccionDto, @CurrentUser() user: any) {
    return this.leccionesService.create(createLeccionDto, user.id_usuario);
  }

  @Get()
  findAll() {
    return this.leccionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leccionesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  update(
    @Param('id') id: string,
    @Body() updateLeccionDto: CreateLeccionDto,
    @CurrentUser() user: any,
  ) {
    return this.leccionesService.update(+id, updateLeccionDto, user.id_usuario, user.rol);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.leccionesService.remove(+id, user.id_usuario, user.rol);
  }
}