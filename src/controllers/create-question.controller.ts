import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt.guard.js";

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreatQuestionController {
    constructor() {}

    @Post()
    async handle() {
        return 'ok';
    }
}