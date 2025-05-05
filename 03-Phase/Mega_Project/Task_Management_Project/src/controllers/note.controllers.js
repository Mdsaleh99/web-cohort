// notes are project wide not system wide means application wide

import mongoose, { mongo } from "mongoose";
import { ProjectNote } from "../models/note.models";
import { Project } from "../models/project.models";
import { ApiError } from "../utils/api-error";
import { asyncHandler } from "../utils/async-handler";
import { ApiResponse } from "../utils/api-response";

const getNotes = asyncHandler(async (req, res) => {
    // get all notes
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId),
    }).populate("createdBy", "username fullname avatar");

    return res
        .status(200)
        .json(new ApiResponse(200, notes, "Notes fetched Successfully"));
});

const getNoteById = async (req, res) => {
    // get note by id
    const { noteId } = req.params;
    const note = await ProjectNote.findById(noteId).populate(
        "createdBy",
        "username fullname avatar",
    ); // createdBy refering to user model so it bring the user details from their using populate() method
    if (!note) {
        throw new ApiError(401, "Note is not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note fetched Successfully"));
};

const createNote = async (req, res) => {
    // create note
    const { projectId } = req.params; // note create karne k liye first project hona chahiye
    const { content } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
        throw new ApiError(401, "Project is not found");
    }

    const note = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        content,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    });

    const populateNote = await ProjectNote.findById(note._id).populate(
        "createdBy",
        "username fullname avatar",
    );

    return res
        .status(201)
        .json(new ApiResponse(201, populateNote, "Note created successfully"));
};

const updateNote = async (req, res) => {
    // update note
    const { noteId } = req.params;
    const { content } = req.body;
    const existingNote = await Project.findById(noteId);

    if (!existingNote) {
        throw new ApiError(401, "Note is not found");
    }

    const updatedNote = await ProjectNote.findByIdAndUpdate(
        noteId,
        { content },
        { new: true }, // update k baad jo new data hai oh return kare
    ).populate("createdBy", "username fullname avatar")

    return res
        .status(200)
        .json(new ApiResponse(200, updatedNote, "Note updated successfully"));
};

const deleteNote = async (req, res) => {
    // delete note
    const { noteId } = req.params
    const note = ProjectNote.findByIdAndDelete(noteId)
    if (!note) {
        throw new ApiError(404, "Note is not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, note, "Note deleted successfully"));
};

export { createNote, deleteNote, getNoteById, getNotes, updateNote };
