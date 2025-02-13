import { BroadcastService } from "../services/broadcast.service";
import { Broadcast } from "../models/schema";

jest.mock("../src/models/schema");

describe("Broadcast Service", () => {
  it("should create a new broadcast", async () => {
    const mockBroadcast = {
      title: "Tech Meetup",
      description: "Discussing AI trends",
      location: "Downtown Cafe",
      expiresAt: new Date(Date.now() + 3600000),
    };

    (Broadcast.create as jest.Mock).mockResolvedValue(mockBroadcast);

    const result = await BroadcastService.createBroadcast(mockBroadcast);
    expect(result).toEqual(mockBroadcast);
  });
});
