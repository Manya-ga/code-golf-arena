// Stores an anonymous arena player and their aggregate Code Golf statistics.
import mongoose from 'mongoose';

const playerSchema = new mongoose.Schema(
  {
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 30,
      unique: true,
    },
    totalScore: {
      type: Number,
      default: 0,
      min: 0,
    },
    gamesPlayed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

export const Player = mongoose.models.Player ?? mongoose.model('Player', playerSchema);
