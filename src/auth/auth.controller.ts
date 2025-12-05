import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    type: RegisterDto,
  })
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('/test')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async test(@Req() request) {
    return {
      credentials: request.credentials,
    };
  }
}
