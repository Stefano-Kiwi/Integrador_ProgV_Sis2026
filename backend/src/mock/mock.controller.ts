import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@Controller('mock')
export class MockController {
  // ==========================================
  // USUARIOS & ROLES
  // ==========================================
  @ApiTags('Mock - Usuarios')
  @Get('usuarios')
  @ApiOperation({ summary: 'Listar usuarios (Mock)', description: 'Retorna usuarios de prueba' })
  @ApiResponse({ status: 200, description: 'Listado de usuarios' })
  getUsuarios() {
    return [
      { id: 1, dni: '40123456', nombre: 'Carlos', apellido: 'Gómez', email: 'carlos@fitzone.com', rol: 'Cliente' },
      { id: 2, dni: '38987654', nombre: 'Laura', apellido: 'Paz', email: 'laura@fitzone.com', rol: 'Instructor' },
      { id: 3, dni: '35123987', nombre: 'Admin', apellido: 'FitZone', email: 'admin@fitzone.com', rol: 'Gerente' },
    ];
  }

  @ApiTags('Mock - Usuarios')
  @Post('usuarios')
  @ApiOperation({ summary: 'Crear usuario (Mock)', description: 'Simula el registro de un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  crearUsuario(@Body() body: { dni: string; nombre: string; apellido: string; email: string; id_rol: number }) {
    return {
      mensaje: 'Usuario registrado con éxito (Simulado)',
      usuario: { id: 4, ...body, creado_at: new Date().toISOString() },
    };
  }

  // ==========================================
  // SEDES
  // ==========================================
  @ApiTags('Mock - Sedes')
  @Get('sedes')
  @ApiOperation({ summary: 'Listar sedes (Mock)' })
  @ApiResponse({ status: 200, description: 'Sedes disponibles' })
  getSedes() {
    return [
      { id: 1, nombre: 'FitZone Concordia Centro', direccion: 'Av. Siempre Viva 123', localidad: 'Concordia', aforo_maximo: 80 },
      { id: 2, nombre: 'FitZone Costanera', direccion: 'Costanera Sur 450', localidad: 'Concordia', aforo_maximo: 120 },
    ];
  }

  // ==========================================
  // MEMBRESÍAS & PLANES
  // ==========================================
  @ApiTags('Mock - Membresías')
  @Get('planes')
  @ApiOperation({ summary: 'Listar planes de membresía (Mock)' })
  @ApiResponse({ status: 200, description: 'Planes activos' })
  getPlanes() {
    return [
      { id: 1, nombre: 'Mensual', duracion_meses: 1, precio: 15000 },
      { id: 2, nombre: 'Trimestral', duracion_meses: 3, precio: 40000 },
      { id: 3, nombre: 'Anual', duracion_meses: 12, precio: 140000 },
    ];
  }

  // ==========================================
  // CLASES & RESERVAS
  // ==========================================
  @ApiTags('Mock - Clases')
  @Get('clases')
  @ApiOperation({ summary: 'Listar clases programadas (Mock)' })
  @ApiResponse({ status: 200, description: 'Clases del día/semana' })
  getClases() {
    return [
      { id: 1, tipo: 'Spinning', instructor: 'Laura Paz', sede: 'FitZone Concordia Centro', inicio: '2026-09-29T18:00:00Z', fin: '2026-09-29T19:00:00Z', cupo_disponible: 5, capacidad_maxima: 20 },
      { id: 2, tipo: 'Yoga', instructor: 'Laura Paz', sede: 'FitZone Concordia Centro', inicio: '2026-09-29T19:30:00Z', fin: '2026-09-29T20:30:00Z', cupo_disponible: 0, capacidad_maxima: 15 },
    ];
  }

  @ApiTags('Mock - Clases')
  @Post('clases/reserva')
  @ApiOperation({ summary: 'Reservar clase (Mock)', description: 'Simula la reserva o envío a lista de espera' })
  @ApiResponse({ status: 201, description: 'Reserva confirmada' })
  @ApiResponse({ status: 409, description: 'Clase llena, ingresado a lista de espera' })
  reservarClase(@Body() body: { clase_id: number; usuario_id: number }) {
    if (body.clase_id === 2) {
      return {
        estado: 'EN_ESPERA',
        mensaje: 'La clase está llena. Has sido agregado a la lista de espera (Posición 1).',
      };
    }
    return {
      estado: 'CONFIRMADA',
      reserva_id: 101,
      mensaje: 'Reserva confirmada con éxito.',
      detalle: body,
    };
  }

  // ==========================================
  // CANCHAS & RESERVAS
  // ==========================================
  @ApiTags('Mock - Canchas')
  @Get('canchas')
  @ApiOperation({ summary: 'Listar canchas deportivas (Mock)' })
  @ApiResponse({ status: 200, description: 'Listado de canchas disponibles' })
  getCanchas() {
    return [
      { id: 1, nombre: 'Cancha 1 (Paddle)', tipo: 'Paddle', costo_hora: 8000, estado: 'HABILITADA' },
      { id: 2, nombre: 'Cancha 2 (Fútbol 5)', tipo: 'Futbol 5', costo_hora: 15000, estado: 'HABILITADA' },
    ];
  }

  @ApiTags('Mock - Canchas')
  @Post('canchas/reserva')
  @ApiOperation({ summary: 'Reservar turno de cancha (Mock)' })
  @ApiResponse({ status: 201, description: 'Turno reservado' })
  reservarCancha(@Body() body: { cancha_id: number; usuario_id: number; fecha: string; hora_inicio: number }) {
    return {
      reserva_id: 55,
      estado: 'PENDIENTE_PAGO',
      monto_total: 8000,
      mensaje: 'Turno bloqueado. Pendiente de pago.',
      detalle: body,
    };
  }

  // ==========================================
  // PAGOS
  // ==========================================
  @ApiTags('Mock - Pagos')
  @Post('pagos/simular')
  @ApiOperation({ summary: 'Simular procesamiento de pago (Mock)' })
  @ApiResponse({ status: 200, description: 'Pago aprobado y comprobante emitido' })
  simularPago(@Body() body: { origen_tipo: 'membresia' | 'cancha'; origen_id: number; monto: number }) {
    return {
      pago_id: 88,
      estado: 'APROBADO',
      token_pasarela: 'tok_mock_' + Math.random().toString(36).substring(2, 9),
      detalle: body,
      comprobante: {
        id: 12,
        archivo_url: 'https://fitzone.com/comprobantes/recibo-mock-88.pdf',
        emitido_at: new Date().toISOString(),
      },
    };
  }
}
