// Actualizar src/palabras/palabras.controller.ts
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PalabrasService } from './palabras.service';
import { CreatePalabraDto } from '../dto/create-palabra.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

@ApiTags('Palabras')
@Controller('palabras')
export class PalabrasController {
  constructor(private palabrasService: PalabrasService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear una nueva palabra' })
  @ApiResponse({ status: 201, description: 'Palabra creada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  create(@Body() createPalabraDto: CreatePalabraDto, @CurrentUser() user: any) {
    return this.palabrasService.create(createPalabraDto, user.id_usuario);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las palabras' })
  @ApiResponse({ status: 200, description: 'Lista de palabras' })
  findAll() {
    return this.palabrasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una palabra por ID' })
  @ApiResponse({ status: 200, description: 'Palabra encontrada' })
  @ApiResponse({ status: 404, description: 'Palabra no encontrada' })
  findOne(@Param('id') id: string) {
    return this.palabrasService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar una palabra' })
  @ApiResponse({ status: 200, description: 'Palabra actualizada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Palabra no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updatePalabraDto: CreatePalabraDto,
    @CurrentUser() user: any,
  ) {
    return this.palabrasService.update(+id, updatePalabraDto, user.id_usuario, user.rol);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Administrador', 'Profesor')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar una palabra' })
  @ApiResponse({ status: 200, description: 'Palabra eliminada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Palabra no encontrada' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.palabrasService.remove(+id, user.id_usuario, user.rol);
  }
}
