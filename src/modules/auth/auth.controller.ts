import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { RefreshTokenGuard } from "./guards/refresh-token-guards";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return await this.authService.register(registerDto);
  }
  @UseGuards(RefreshTokenGuard)
  async refresh(@GetUser("id") userId: string): Promise<AuthResponseDto> {
    return await this.authService.refreshTokens(userId);
  }
}
