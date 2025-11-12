import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { hash } from 'bcryptjs';
import { email, z } from 'zod';
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";

const createAccountBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6)
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccountBodySchema))
    async handle(@Body() body: CreateAccountBodySchema) {
        const { name, email, password } = body;

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userWithSameEmail) {
            throw new ConflictException('User with same e-mail address already exists');
        }

        const hashedPassword = await hash(password, 8);

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
    }
}