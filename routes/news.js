/**
 * @swagger
 * components:
 *   schemas:
 *     NewSchema:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - content
 *         - author
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the new
 *         title:
 *           type: string
 *           description: The title of the new
 *         description:
 *           type: string
 *           description: The description of the new
 *         date:
 *           type: string
 *           format: date
 *           description: The date when was published the new
 *         content:
 *           type: string
 *           description: The content of the new
 *         author:
 *           type: string
 *           description: The new author
 *         archiveDate:
 *           type: string
 *           format: date
 *           description: The date the book was archived
 *       example:
 *         _id: d5fE_asz
 *         title: La importancia de la lectura
 *         description: La lectura es una actividad fundamental para el desarrollo de las personas
 *         date: 2020-03-10T04:05:06.157Z
 *         content: La lectura es una actividad fundamental para el desarrollo de las personas. Nos permite conocer el mundo que nos rodea, aprender de la historia y mejorar nuestra capacidad de comprensión y análisis.
 *         author: Alexander K. Dewdney
 *         createdAt: 2020-03-10T04:05:06.157Z
 */
/**
 * @swagger
 * tags:
 *   name: News
 *   description: The news managing API
 */
import { Router } from "express";
import { News } from "../utils/news.schema.js";

const newsRouter = Router();

/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: Lists all the news
 *     tags: [News]
 *     responses:
 *       200:
 *         description: The list of the news
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewSchema'
 *       500:
 *         description: Internal server error
 */
newsRouter.get("/", async (req, res) => {
  try {
    const news = await News.find({ archiveDate: null }).sort({ date: -1 });
    res.status(200).json(news).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }).end();
  }
});

/**
 * @swagger
 * /api/news/archived:
 *   get:
 *     summary: Lists all the news archived
 *     tags: [News]
 *     responses:
 *       200:
 *         description: The list of the news archived
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewSchema'
 *       500:
 *         description: Internal server error
 */
newsRouter.get("/archived", async (req, res) => {
  try {
    const archivedNews = await News.find({ archiveDate: { $ne: null } }).sort({
      archiveDate: -1,
    });
    res.status(200).json(archivedNews).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }).end();
  }
});

/**
 * @swagger
 * /api/news/init:
 *   post:
 *     summary: Initialize the database with default news data
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Database initialized with default news data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Database initialized with default news data
 *       500:
 *         description: Internal server error
 */
newsRouter.post("/init", async (req, res) => {
  const defaultNews = [
    {
      title: "News 1",
      description: "Descripción 1",
      date: new Date(),
      content: "Content for news 1",
      author: "Autor 1",
    },
    {
      title: "News 2",
      description: "Descripción 2",
      date: new Date(),
      content: "Content for news 2",
      author: "Autor 2",
    },
    {
      title: "News 3",
      description: "Descripción 3",
      date: new Date(),
      content: "Content for news 3",
      author: "Autor 3",
    },
  ];

  try {
    await News.insertMany(defaultNews);
    res
      .status(200)
      .json({ message: "Database initialized with default news data" })
      .end();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error initializing database", error })
      .end();
  }
});

/**
 * @swagger
 * /api/news/{id}/archive:
 *   put:
 *     summary: Archive the new by id
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The new id
 *     responses:
 *       200:
 *         description: The new was archived
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewSchema'
 *       404:
 *         description: The new was not found
 *       400:
 *         description: The new is already archived
 *       500:
 *         description: Some error happened
 *
 */
newsRouter.put("/:id/archive", async (req, res) => {
  try {
    const newId = req.params.id;
    const news = await News.findById(newId);

    if (!news) {
      return res.status(404).json({ error: "News item not found" }).end();
    }

    if (news.archiveDate !== null) {
      return res
        .status(400)
        .json({ error: "News item is already archived" })
        .end();
    }

    news.archiveDate = new Date();
    await news.save();

    // Filter the updated news to only return those that are not archived
    const nonArchivedNews = await News.find({ archiveDate: null }).sort({
      date: -1,
    });

    res.status(200).json(nonArchivedNews).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }).end();
  }
});

/**
 * @swagger
 * /api/news/{id}:
 *   delete:
 *     summary: Remove the new by id
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The new id
 *     responses:
 *       200:
 *         description: The new was removed
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NewSchema'
 *       404:
 *         description: The new was not found
 *       400:
 *         description: The new can't be removed because is not archived
 *       500:
 *         description: Internal server error
 */
newsRouter.delete("/:id", async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ error: "News item not found" }).end();
    }

    if (news.archiveDate === null) {
      return res.status(400).json({ error: "News item is not archived" }).end();
    }

    await News.findByIdAndDelete(req.params.id);

    // Fetch the updated list of archived news
    const archivedNews = await News.find({ archiveDate: { $ne: null } }).sort({
      archiveDate: -1,
    });

    res.status(200).json(archivedNews).end();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }).end();
  }
});

export { newsRouter };
