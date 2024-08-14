import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { Role } from './Role.enum';
import { ROLES_KEY } from './roles.decorator';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken =await this.jwtService.verifyAsync(token,{
      secret: jwtConstants.secret,
    });
    const userRole = decodedToken['role'];
    
    // const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => userRole.includes(role));
  }
}