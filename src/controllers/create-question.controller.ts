import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { UserPayload } from "../auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";
import { PrismaService } from "../prisma/prisma.service.js";

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),

});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreatQuestionController {
    constructor(
        private prisma: PrismaService
    ) {}

    @Post()
    async handle(
        @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body;
        const { sub: userId } = user;
        const slug = this.generateSlug(title)

        await this.prisma.question.create({
            data: {
                slug,
                title,
                content,
                authorId: userId
            }
        });
    }

    private generateSlug(title: string) {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
}