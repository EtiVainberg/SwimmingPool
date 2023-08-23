import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/Roles/Role.enum';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private userService: UsersService,
    private jwtService: JwtService
  ) { }

  async signIn(email: string, password: string) {
    const user = {
      firstName: "",
      lastName: "",
      email: email,
      phone: "",
      address: "",
      password: "",
      role: Role.User
    }
    const foundUser = await this.userService.findOne(user);
    if (!foundUser) {
      throw new NotFoundException("User not exist! please register!!");
    }
    if (!(await bcrypt.compare(password, foundUser.password))) {
      throw new UnauthorizedException();
    }
    return this.getToken(email, password, foundUser.role);
  }

  async getToken(email: string, password: string, role: Role) {
    const payload = { email: email, password: password, role: role };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: '6h', // Token expires after 6 hours.
      secret: jwtConstants.secret, // Secret key for JWT
    });
    return [access_token, role];
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async decoded(token: string) {
    let decodedToken: { [x: string]: string; };
    try {
      decodedToken = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      return decodedToken;
    }
    catch (error) {
      const status = HttpStatus.UNAUTHORIZED;
      throw new HttpException({ message: error.message, status }, HttpStatus.UNAUTHORIZED);
    }
  }

}




