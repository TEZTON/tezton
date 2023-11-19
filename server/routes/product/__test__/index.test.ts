import { migrate } from "drizzle-orm/libsql/migrator";
import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";
import { Auth, getAuth } from "firebase-admin/auth";

import { app } from "../../../app";
import { getDbInstance } from "../../../db";
import { seedCompany, seedUser } from "../../../seed_database";

const testId = faker.string.uuid();
const testId2 = faker.string.uuid();
const filename = `${faker.internet.userName()}-${new Date().getTime()}.db`;

vi.mock("firebase-admin/auth");

test("CRUD /product", async () => {
  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  // get company id
  let companyId;
  await request(app)
    .get(`/api/company`)
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      companyId = res.body[0].id;
    });

  let productId;
  // create product
  await request(app)
    .post(`/api/company/${companyId}/product`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    })
    .expect(200)
    .then((res) => {
      productId = res.body;
    });

  // update product
  let newName = faker.commerce.productName();
  let newDescription = faker.commerce.productDescription();
  await request(app)
    .patch(`/api/company/${companyId}/product/${productId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(200);

  //getbyId
  await request(app)
    .get(`/api/company/${companyId}/product/${productId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe(newName);
      expect(res.body.description).toBe(newDescription);
    });

  // delete company should cascade
  await request(app)
    .delete(`/api/company/${companyId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200);

  //getbyId invalid id
  await request(app)
    .get(`/api/company/${companyId}/product/${productId}`)
    .set({ Authorization: "Bearer a" })
    .expect(404);
});

test.skip("ACL /product", async () => {});

beforeAll(async () => {
  let instance = getDbInstance(`file:${filename}`);
  await migrate(instance, {
    migrationsFolder: "drizzle",
  });
  await seedUser(instance, [testId, testId2]);
  await seedCompany(instance, testId);
  await seedCompany(instance, testId2);
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
});
