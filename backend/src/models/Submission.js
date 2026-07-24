// Stores a submission, Judge0 result, and Code Golf score for one player.
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
      index: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      index: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    sourceCode: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    codeLength: { type: Number, required: true, min: 0 },
    judgeStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'error'],
      default: 'pending',
      index: true,
    },
    judgeToken: { type: String, default: null },
    executionTime: { type: Number, default: null },
    memoryUsed: { type: Number, default: null },
    compilerOutput: { type: String, default: null },
    feedbackStatus: {
      type: String,
      enum: ['disabled', 'pending', 'completed', 'error'],
      default: 'disabled',
      index: true,
    },
    aiFeedback: { type: String, default: null },
    feedbackError: { type: String, default: null },
  },
  { timestamps: true },
);

submissionSchema.index({ room: 1, problem: 1, codeLength: 1 });
submissionSchema.index({ feedbackStatus: 1, createdAt: 1 });

export const Submission = mongoose.models.Submission ?? mongoose.model('Submission', submissionSchema);
