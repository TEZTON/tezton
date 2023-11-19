import { migrate } from "drizzle-orm/libsql/migrator";
import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";
import { Auth, getAuth } from "firebase-admin/auth";

import { app } from "../../../app";
import { getDbInstance } from "../../../db";
import { seedProducts, seedUser } from "../../../seed_database";

const testId = faker.string.uuid();
const testId2 = faker.string.uuid();
const filename = `${faker.internet.userName()}-${new Date().getTime()}.db`;
let companyId: string;
let productId: string;

vi.mock("firebase-admin/auth");
let aclprojectId: string;

test("CRUD /project", async () => {
  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  let projectId;

  // create project
  await request(app)
    .post(`/api/product/${productId}/project`)
    .send({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    })
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      projectId = res.body;
    });

  // update project
  let newName = faker.commerce.productName();
  let newDescription = faker.commerce.productDescription();
  await request(app)
    .patch(`/api/product/${productId}/project/${projectId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(200);

  // get byId
  await request(app)
    .get(`/api/product/${productId}/project/${projectId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe(newName);
      expect(res.body.description).toBe(newDescription);
    });

  // delete
  await request(app)
    .delete(`/api/product/${productId}/project/${projectId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200);

  await request(app)
    .get(`/api/product/${productId}/project/${projectId}`)
    .set({ Authorization: "Bearer a" })
    .expect(404);

  // create project
  await request(app)
    .post(`/api/product/${productId}/project`)
    .send({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    })
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      aclprojectId = res.body;
    });
});

test("ACL /project", async () => {
  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  // get byId
  await request(app)
    .get(`/api/product/${productId}/project/${aclprojectId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200);

  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId2,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  await request(app)
    .get(`/api/product/${productId}/project/${aclprojectId}`)
    .set({ Authorization: "Bearer a" })
    .expect(404);
});

beforeAll(async () => {
  let instance = getDbInstance(`file:${filename}`);
  await migrate(instance, {
    migrationsFolder: "drizzle",
  });
  await seedUser(instance, [testId, testId2]);
  [companyId, productId] = await seedProducts(instance, testId);
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
});
