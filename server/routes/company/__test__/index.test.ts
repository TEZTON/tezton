import { migrate } from "drizzle-orm/libsql/migrator";
import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";
import { Auth, getAuth } from "firebase-admin/auth";

import { app } from "../../../app";
import { getDbInstance } from "../../../db";
import { seedCompany, seedUser } from "../../../seed_database";
import { companiesSchema } from "../../../schema";

const testId = faker.string.uuid();
const testId2 = faker.string.uuid();
const filename = `${faker.internet.userName()}-${new Date().getTime()}.db`;

const instance = getDbInstance(`file:${filename}`);
vi.mock("firebase-admin/auth");

describe("basic CRUD", async () => {
  let selectedCompanyId: string;
  beforeEach(() => {
    vi.mocked(getAuth).mockReturnValue({
      verifyIdToken: () => ({
        uid: testId,
      }),
      createUser: vi.fn().mockResolvedValue({ uid: testId }),
    } as unknown as Auth);
  });

  it("should return empty list of companies", async () => {
    await request(app)
      .get("/api/company/allowed")
      .set({ Authorization: "Bearer a" })
      .expect(200)
      .expect([]);
  });

  it("should create the company", async () => {
    await request(app)
      .post("/api/company")
      .set({ Authorization: "Bearer a" })
      .send({
        name: faker.company.name(),
      })
      .expect(200);

    let response = await request(app)
      .get("/api/company/allowed")
      .set({ Authorization: "Bearer a" })
      .expect(200);

    expect(response.body.length).toBe(1);
    selectedCompanyId = response.body[0].id;
  });

  it("should be able to update the company correctly", async () => {
    let newName = faker.company.name();

    // Update name
    await request(app)
      .patch(`/api/company/${selectedCompanyId}`)
      .set({ Authorization: "Bearer a" })
      .send({
        name: newName,
      })
      .expect(200);

    await request(app)
      .get(`/api/company/${selectedCompanyId}`)
      .set({ Authorization: "Bearer a" })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toBe(newName);
      });
  });

  it("should be able to delete the company", async () => {
    await request(app)
      .delete(`/api/company/${selectedCompanyId}`)
      .set({ Authorization: "Bearer a" })
      .expect(200);

    // Check that company is deleted
    await request(app)
      .get("/api/company/allowed")
      .set({ Authorization: "Bearer a" })
      .expect(200)
      .expect([]);
  });

  describe("ACL", () => {
    beforeAll(async () => {
      await instance.delete(companiesSchema).all();

      await seedCompany(instance, testId, 10);
    });

    let selectedCompanyId: string;

    test("should be able to read all companies", async () => {
      vi.mocked(getAuth).mockReturnValue({
        verifyIdToken: () => ({
          uid: testId2,
        }),
        createUser: vi.fn().mockResolvedValue({ uid: testId }),
      } as unknown as Auth);

      let result = await request(app)
        .get("/api/company")
        .set({ Authorization: "Bearer a" })
        .expect(200);

      expect(result.body.length).toBe(10);
      selectedCompanyId = result.body[0].id;
    });

    test("should NOT be able to read specific details of a company that I do not have access to", async () => {
      vi.mocked(getAuth).mockReturnValue({
        verifyIdToken: () => ({
          uid: testId2,
        }),
        createUser: vi.fn().mockResolvedValue({ uid: testId }),
      } as unknown as Auth);

      await request(app)
        .get(`/api/company/${selectedCompanyId}`)
        .set({ Authorization: "Bearer a" })
        .expect(404);
    });
  });
});

beforeAll(async () => {
  await migrate(instance, {
    migrationsFolder: "drizzle",
  });
  await seedUser(instance, [testId, testId2]);
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
});
