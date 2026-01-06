import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
// import { Request } from 'express';

interface RequestWithUser extends Request {
  user: { id: number; email: string };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() authDto: AuthDto) {
    return this.authService.AuthLogin(authDto);
  }

  @UseGuards(AuthGuard)
  @Get('/me')
  me(@Request() req: RequestWithUser) {
    return req.user;
  }
}
