import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async AuthLogin(authDto: AuthDto): Promise<{ access_token: string }> {
    const userExists = await this.findByEmail(authDto.email);

    if (!userExists) {
      throw new NotFoundException('user not exist');
    }
    const matchPassword = await bcrypt.compare(
      authDto.password,
      userExists?.password,
    );

    if (!matchPassword) {
      throw new UnauthorizedException('User or Password not match');
    }

    const payload = { sub: userExists.id, username: userExists.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  AuthMe() {}

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }
}
