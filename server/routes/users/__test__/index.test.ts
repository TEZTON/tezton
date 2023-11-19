import { migrate } from "drizzle-orm/libsql/migrator";
import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";
import { Auth, getAuth } from "firebase-admin/auth";

import { app } from "../../../app";
import { getDbInstance } from "../../../db";

const filename = `${faker.internet.userName()}-${new Date().getTime()}.db`;
const testId = faker.string.uuid();
const testId2 = faker.string.uuid();
let email = faker.internet.email();

vi.mock("firebase-admin/auth");

test("POST /user", async () => {
  vi.mocked(getAuth).mockReturnValueOnce({
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  await migrate(getDbInstance(`file:${filename}`), {
    migrationsFolder: "drizzle",
  });
  await request(app)
    .post("/api/user")
    .send({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
    })
    .expect(200);
});

test("POST /user - should not allow same email twice ", async () => {
  vi.mocked(getAuth).mockReturnValueOnce({
    createUser: vi.fn().mockResolvedValue({ uid: testId2 }),
  } as unknown as Auth);

  await migrate(getDbInstance(`file:${filename}`), {
    migrationsFolder: "drizzle",
  });
  await request(app)
    .post("/api/user")
    .send({
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
    })
    .expect(400)
    .expect({
      code: "BAD_REQUEST",
      message: "This email address is taken.",
    });
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
});
