// Stores a live Code Golf match, its shared language, participants, and selected problem.
import mongoose from 'mongoose';

const roomPlayerSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const roomSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 6,
      maxlength: 12,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      default: null,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    players: {
      type: [roomPlayerSchema],
      default: [],
    },
    maxPlayers: {
      type: Number,
      default: 8,
      min: 2,
      max: 20,
    },
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'finished'],
      default: 'waiting',
    },
    startedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const Room = mongoose.models.Room ?? mongoose.model('Room', roomSchema);
