import { Router } from "express";
import { BroadcastController } from "../controllers/broadcast.controller";
import { broadcastLimiter } from "../middleware/rateLimiter";

const router = Router();

/**
 * @swagger
 * /api/broadcasts:
 *   post:
 *     summary: Create a new broadcast
 *     description: Users can create a spontaneous meetup broadcast.
 *     
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tech Meetup"
 *               description:
 *                 type: string
 *                 example: "Discussing new tech trends"
 *               hostId:
 *                 type: string
 *                 example: "1232"
 *               location:
 *                 type: string
 *                 example: "Downtown Cafe"
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-02-20T10:00:00Z"
 *     responses:
 *       201:
 *         description: Broadcast created successfully
 *       400:
 *         description: Bad request (validation error)
 */

router.post("/",broadcastLimiter, BroadcastController.create);

/**
 * @swagger
 * /api/broadcasts/bulk:
 *   get:
 *     summary: Get all active broadcasts
 *     responses:
 *       200:
 *         description: List of active broadcasts
 */
router.get("/bulk", BroadcastController.getAll);

/**
 * @swagger
 * /api/broadcasts/{id}:
 *   get:
 *     summary: Get a broadcast by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the broadcast to retrieve
 *     responses:
 *       200:
 *         description: Broadcast retrieved successfully
 *       404:
 *         description: Broadcast not found
 */
router.get("/:id", BroadcastController.get);


/**
 * @swagger
 * /api/broadcasts:
 *   get:
 *     summary: Get broadcasts with sorting, filtering, and searching
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by title, description, or location.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, expiresAt, popularity]
 *         description: Sort by createdAt, expiresAt, or popularity.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sorting order.
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location.
 *       - in: query
 *         name: hostId
 *         schema:
 *           type: string
 *         description: Filter by host ID.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: List of broadcasts
 *       500:
 *         description: Internal server error
 */
router.get("/" , BroadcastController.getAllBySearch);

/**
 * @swagger
 * /api/broadcasts/{id}/join:
 *   post:
 *     summary: Join a broadcast
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the broadcast to join
 *     responses:
 *       200:
 *         description: Successfully joined the broadcast
 */
router.post("/:id/join", BroadcastController.join);

export default router;
