import createHttpError from "http-errors";

import Note from "../models/note.js";

export const getAllNotes = async (req, res) => {
  const { page, perPage, tag, search } = req.query;
  const currentPage = Number(page);
  const itemsPerPage = Number(perPage);
  const filter = {};

  if (tag) {
    filter.tag = tag;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
  }

  const [notes, totalNotes] = await Promise.all([
    Note.find(filter)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage),
    Note.countDocuments(filter),
  ]);

  res.status(200).json({
    page: currentPage,
    perPage: itemsPerPage,
    totalNotes,
    totalPages: Math.ceil(totalNotes / itemsPerPage),
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.noteId);

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.noteId, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!note) {
    throw createHttpError(404, "Note not found");
  }

  res.status(200).json(note);
};
