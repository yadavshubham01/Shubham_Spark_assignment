import request from "supertest";
import app from "../server";
import { Broadcast } from "../models/schema";

jest.mock("../models/schema");

describe("Broadcast API Endpoints", () => {
  it("should create a new broadcast", async () => {
    const response = await request(app)
      .post("/api/broadcasts")
      .send({
        title: "Tech Meetup",
        description: "Discussing AI",
        hosdId: "1232",
        location: "Downtown Cafe",
        expiresAt: new Date(Date.now() + 3600000),
      });

    expect(response.status).toBe(201);
  });

  it("should get all active broadcasts", async () => {
    const response = await request(app).get("/api/broadcasts/bulk");
    expect(response.status).toBe(200);
  });

});
