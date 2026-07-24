// Stores a Code Golf challenge, its supported languages, and private Judge0 test cases.
import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: '' },
    expectedOutput: { type: String, required: true },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    inputDescription: { type: String, default: '' },
    outputDescription: { type: String, default: '' },
    constraints: { type: String, default: '' },
    supportedLanguages: {
      type: [
        {
          type: String,
          required: true,
          trim: true,
          lowercase: true,
        },
      ],
      required: true,
      validate: [
        (languages) => languages.length > 0,
        'At least one supported language is required.',
      ],
    },
    testCases: {
      type: [testCaseSchema],
      required: true,
      select: false,
      validate: [(testCases) => testCases.length > 0, 'At least one test case is required.'],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Problem = mongoose.models.Problem ?? mongoose.model('Problem', problemSchema);
