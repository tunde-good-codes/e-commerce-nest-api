import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dto/login-dto";
@Injectable()
export class AuthService {
  private readonly SALT_HASH = 12;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const { email, password, firstName, lastName } = registerDto;

      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new ConflictException("user with this email exist already");
      }

      const hashPassword = await bcrypt.hash(password, this.SALT_HASH);
      const user = await this.prismaService.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashPassword,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
          email: true,
          password: false,
        },
      });

      const tokens = await this.generateTokens(user.id, user.email);

      await this.updateRefreshToken(user.id, tokens.refreshToken);

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      console.error("Error during user registration:", error);
      throw new InternalServerErrorException(
        "An error occurred during registration",
      );
    }
  }

  // generate access and refreshToken
  private async generateTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };
    const refreshId = randomBytes(16).toString("hex");
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: "15m",
        secret: this.configService.get<string>("JWT_SECRET"),
      }),
      this.jwtService.signAsync(
        { ...payload, refreshId },
        {
          expiresIn: "7d",
          secret: this.configService.get<string>("JWT_REFRESH_SECRET"),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken },
    });
  }

  async refreshTokens(userId: string): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user,
    };
  }

  // Log out
  async logout(userId: string): Promise<void> {
    await this.prismaService.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  // Login
  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = await this.generateTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
