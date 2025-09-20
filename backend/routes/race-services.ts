import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth-middleware";
import prisma from "../utils/prisma.utility";

const router = Router()


router.route("/race").get(authMiddleware, async (req, res) => {})
router.route("/race/:id").get(authMiddleware, async (req, res) => {})
router.route("/race").post(authMiddleware, async (req, res) => {})
router.route("/race/:id/join").get(authMiddleware, async (req, res) => {})
router.route("/race/:id/leave").get(authMiddleware, async (req, res) => {})
router.route("/race/:id/checkin").get(authMiddleware, async (req, res) => {})
router.route("/race/:id/leaderboard").get(authMiddleware, async (req, res) => {})
