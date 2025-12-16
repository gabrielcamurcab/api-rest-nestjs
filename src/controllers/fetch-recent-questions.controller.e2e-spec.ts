import { AppModule } from "@/app.module.js";
import { PrismaService } from "@/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";

describe("Fetch Recent Questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        email: "johndoe@example.com",
        password: "123456", // Sem hashing porque autenticação não será necessária
        name: "John Dowe",
      },
    });

    await prisma.question.create({
      data: {
        title: "New question",
        content: "Question content",
        slug: "new-question",
        authorId: user.id,
      },
    });

    const accessToken = await jwt.sign({ sub: user.id });

    const response = await request(app.getHttpServer())
      .get("/questions?page=1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    expect(response.body).toEqual({
      questions: [
        {
          title: expect.any(String),
          content: expect.any(String),
          createdAt: expect.any(String),
        },
      ],
      page: expect.any(String),
      per_page: expect.any(Number),
      total: expect.any(Number),
      total_pages: expect.any(Number),
    });
  });
});
