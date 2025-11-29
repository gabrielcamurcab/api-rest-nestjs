import { Body, Controller, Get, HttpCode, Post, Query, UseGuards, UsePipes } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { UserPayload } from "../auth/jwt.strategy.js";
import z from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";
import { PrismaService } from "../prisma/prisma.service.js";

const fetchQuestionBodySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
});

type FetchQuestionBodySchema = z.infer<typeof fetchQuestionBodySchema>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchQuestionsController {
    constructor(
        private prisma: PrismaService
    ) {}

    @Get()
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(fetchQuestionBodySchema))
    async handle(
        @CurrentUser() user: UserPayload,
        @Query() { page }: FetchQuestionBodySchema
    ) {
        const { sub: userId } = user;
        const per_page = 10;

        const questions = await this.prisma.question.findMany({
            where: {
                authorId: userId
            },
            select: {
                title: true,
                content: true,
                createdAt: true
            },
            skip: (page - 1) * per_page,
            take: per_page,
            orderBy: {
                createdAt: "desc"
            }
        });

        const total = await this.prisma.question.count();
        const total_pages = Math.ceil(total / per_page);

        return {
            questions: questions,
            page,
            per_page,
            total,
            total_pages
        };
    }
}