import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  userId: string;
  phoneNumber: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(userId: string, phoneNumber: string): string {
    return this.jwtService.sign({ userId, phoneNumber });
  }

  verifyToken(token: string): JwtPayload {
    return this.jwtService.verify<JwtPayload>(token);
  }
}
