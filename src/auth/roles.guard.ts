import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Leer roles requeridos desde el decorador @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // ruta que NO requiere roles
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    // Comparar rol del usuario vs rol requerido
    if (!requiredRoles.includes(user.rol)) {
      throw new ForbiddenException(
        `No tienes permisos. Se requiere rol: ${requiredRoles.join(', ')}`,
      );
    }

    return true;
  }
}
