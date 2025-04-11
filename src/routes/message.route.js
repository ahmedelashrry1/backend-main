import express from "express";
import { getUsersForSidebar,sendMessage, getMessages } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middlewate.js";

const router = express.Router();

router.get('/users',protectRoute,getUsersForSidebar)
router.post('/:id',protectRoute,getMessages)

router.post('/send/:id',protectRoute,sendMessage)

export default router