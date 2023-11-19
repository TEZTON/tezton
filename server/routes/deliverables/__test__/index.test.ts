import { migrate } from "drizzle-orm/libsql/migrator";
import { faker } from "@faker-js/faker";
import fs from "fs";
import request from "supertest";
import { Auth, getAuth } from "firebase-admin/auth";

import { app } from "../../../app";
import { getDbInstance } from "../../../db";
import { seedFunctionalities, seedUser } from "../../../seed_database";

const testId = faker.string.uuid();
const testId2 = faker.string.uuid();
const filename = `${faker.internet.userName()}-${new Date().getTime()}.db`;
let projectId: string;
let funcId: string;

vi.mock("firebase-admin/auth");
let aclDeliverableId: string;

test("CRUD /deliverable", async () => {
  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  let deliverableId;

  // create functionality
  await request(app)
    .post(`/api/functionality/${funcId}/deliverable`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: faker.company.name(),
      description: faker.company.buzzAdjective(),
    })
    .expect(200)
    .then((res) => (deliverableId = res.body));

  // update functionality
  let newName = faker.company.name();
  let newDescription = faker.company.buzzAdjective();
  await request(app)
    .patch(`/api/functionality/${funcId}/deliverable/${deliverableId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(200);

  //byId
  await request(app)
    .get(`/api/functionality/${funcId}/deliverable/${deliverableId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(200)
    .then((res) => {
      expect(res.body.name).toBe(newName);
      expect(res.body.description).toBe(newDescription);
    });

  // delete
  await request(app)
    .delete(`/api/functionality/${funcId}/deliverable/${deliverableId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(200);

  //byId
  await request(app)
    .get(`/api/functionality/${funcId}/deliverable/${deliverableId}`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: newName,
      description: newDescription,
    })
    .expect(404);

  await request(app)
    .post(`/api/functionality/${funcId}/deliverable`)
    .set({ Authorization: "Bearer a" })
    .send({
      name: faker.company.name(),
      description: faker.company.buzzAdjective(),
    })
    .expect(200)
    .then((res) => (aclDeliverableId = res.body));

  await request(app)
    .get(`/api/functionality/${funcId}/deliverable`)
    .set({ Authorization: "Bearer a" })
    .expect(200)
    .then((res) => {
      expect(res.body.length).toBe(1);
    });
});

test("ACL /functionality", async () => {
  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  // get byId
  await request(app)
    .get(`/api/functionality/${funcId}/deliverable/${aclDeliverableId}`)
    .set({ Authorization: "Bearer a" })
    .expect(200);

  vi.mocked(getAuth).mockReturnValue({
    verifyIdToken: () => ({
      uid: testId2,
    }),
    createUser: vi.fn().mockResolvedValue({ uid: testId }),
  } as unknown as Auth);

  await request(app)
    .get(`/api/functionality/${funcId}/deliverable/${aclDeliverableId}`)
    .set({ Authorization: "Bearer a" })
    .expect(404);
});

beforeAll(async () => {
  let instance = getDbInstance(`file:${filename}`);
  await migrate(instance, {
    migrationsFolder: "drizzle",
  });
  await seedUser(instance, [testId, testId2]);
  [projectId, funcId] = await seedFunctionalities(instance, testId);
});

afterEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename);
  }
});