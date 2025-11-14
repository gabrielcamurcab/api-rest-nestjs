import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { compare, hash } from 'bcryptjs';
import { email, z } from 'zod';
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";
import { JwtService } from "@nestjs/jwt";

const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
export class AuthenticateController {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService
    ) {}

    @Post()
    @UsePipes(new ZodValidationPipe(authenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body;

        const user = await this.prisma.user.findUnique({where: { email }});

        if (!user) {
            throw new UnauthorizedException('Users credentials do not match.');
        }

        const isPasswordValid = compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Users credentials do not match.');
        }

        const accessToken = this.jwt.sign({
            sub: user.id
        });

        return {
            access_token: accessToken
        };
    }
}