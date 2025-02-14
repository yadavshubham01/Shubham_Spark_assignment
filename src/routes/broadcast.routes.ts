import { Router } from "express";
import { BroadcastController } from "../controllers/broadcast.controller";
import { broadcastLimiter } from "../middleware/rateLimiter";
import { JoinRequestController } from "../controllers/JoinRequestController";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/broadcasts:
 *   post:
 *     summary: Create a new broadcast
 *     description: Users can create a spontaneous meetup broadcast.
 *     security:
 *       - BearerAuth: []  
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
 *       401:
 *         description: Unauthorized (Missing or invalid token)
 */
router.post("/", broadcastLimiter, authMiddleware, BroadcastController.create);

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
router.get("/", BroadcastController.getAllBySearch);

/**
 * @swagger
 * /api/broadcasts/{id}:
 *   put:
 *     summary: Update a broadcast
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Broadcast updated
 *       403:
 *         description: Not authorized
 */
router.put("/:id", authMiddleware, BroadcastController.update);

/**
 * @swagger
 * /api/broadcasts/{id}:
 *   delete:
 *     summary: Delete a broadcast
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Broadcast deleted
 *       403:
 *         description: Not authorized
 */
router.delete("/:id", authMiddleware, BroadcastController.delete);

/**
 * @swagger
 * /api/broadcasts/{id}/join:
 *   post:
 *     summary: Request to join a broadcast
 *     description: A user requests to join a specific broadcast.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the broadcast to join.
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []  
 *     responses:
 *       201:
 *         description: Successfully requested to join the broadcast.
 *       400:
 *         description: Bad request (e.g., missing user ID).
 *       500:
 *         description: Internal server error.
 */
router.post("/:id/join", authMiddleware, JoinRequestController.requestJoin);

/**
 * @swagger
 * /api/broadcasts/{broadcastId}/join/{userId}:
 *   patch:
 *     summary: Approve or reject a join request
 *     description: Updates the status of a join request (approved/rejected).
 *     security:
 *       - BearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: broadcastId
 *         required: true
 *         description: The ID of the broadcast.
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose request is being updated.
 *         schema:
 *           type: string
 *     requestBody: 
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Successfully updated the join request.
 *       400:
 *         description: Invalid request (e.g., missing status).
 *       404:
 *         description: Join request not found.
 *       500:
 *         description: Internal server error.
 */
router.patch("/:broadcastId/join/:userId", authMiddleware, JoinRequestController.handleRequest);

export default router;
