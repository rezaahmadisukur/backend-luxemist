import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async AuthLogin(authDto: AuthDto): Promise<LoginResponseDto> {
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
      message: 'Login Successfully',
      token: await this.jwtService.signAsync(payload),
      admin: {
        id: userExists.id,
        name: userExists.name,
        email: userExists.email,
      },
    };
  }

  async AuthMe(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const result = {
      admin: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    return result;
  }

  async findByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    return user;
  }
}
