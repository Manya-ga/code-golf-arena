// Seeds a small set of runnable challenges for a new local Code Golf Arena database.
import mongoose from 'mongoose';

import { connectDatabase } from '../src/config/db.js';
import { Problem } from '../src/models/Problem.js';

const sharedLanguages = ['python', 'javascript', 'java', 'c++'];

const problems = [
  {
    title: 'Sum Two Numbers',
    description: 'Read two integers and print their sum.',
    inputDescription: 'Two space-separated integers.',
    outputDescription: 'Their sum followed by a newline.',
    constraints: 'Each integer is between -1,000,000 and 1,000,000.',
    supportedLanguages: sharedLanguages,
    testCases: [
      { input: '2 3\n', expectedOutput: '5\n' },
      { input: '-8 11\n', expectedOutput: '3\n' },
    ],
  },
  {
    title: 'Reverse a Word',
    description: 'Read one word and print it in reverse order.',
    inputDescription: 'One lowercase word.',
    outputDescription: 'The reversed word followed by a newline.',
    constraints: 'The word contains 1 to 100 ASCII lowercase letters.',
    supportedLanguages: sharedLanguages,
    testCases: [
      { input: 'arena\n', expectedOutput: 'anera\n' },
      { input: 'golf\n', expectedOutput: 'flog\n' },
    ],
  },
  {
    title: 'Multiply Two Numbers', description: 'Read two integers and print their product.', inputDescription: 'Two space-separated integers.', outputDescription: 'Their product followed by a newline.', constraints: 'Each integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '4 5\n', expectedOutput: '20\n' }, { input: '-3 7\n', expectedOutput: '-21\n' }],
  },
  {
    title: 'Even or Odd', description: 'Read an integer and print Even when it is divisible by two; otherwise print Odd.', inputDescription: 'One integer.', outputDescription: 'Even or Odd followed by a newline.', constraints: 'The integer is between -1,000,000,000 and 1,000,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '8\n', expectedOutput: 'Even\n' }, { input: '-3\n', expectedOutput: 'Odd\n' }],
  },
  {
    title: 'Largest of Three', description: 'Read three integers and print the largest value.', inputDescription: 'Three space-separated integers.', outputDescription: 'The largest integer followed by a newline.', constraints: 'Each integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '3 9 5\n', expectedOutput: '9\n' }, { input: '-1 -7 -3\n', expectedOutput: '-1\n' }],
  },
  {
    title: 'Absolute Difference', description: 'Read two integers and print their non-negative difference.', inputDescription: 'Two space-separated integers.', outputDescription: 'The absolute difference followed by a newline.', constraints: 'Each integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '10 4\n', expectedOutput: '6\n' }, { input: '-2 5\n', expectedOutput: '7\n' }],
  },
  {
    title: 'Square a Number', description: 'Read an integer and print its square.', inputDescription: 'One integer.', outputDescription: 'The square followed by a newline.', constraints: 'The integer is between -30,000 and 30,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '12\n', expectedOutput: '144\n' }, { input: '-4\n', expectedOutput: '16\n' }],
  },
  {
    title: 'Count Characters', description: 'Read one line and print the number of characters in it, including spaces.', inputDescription: 'One line of text.', outputDescription: 'Its character count followed by a newline.', constraints: 'The line has at most 1,000 characters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'code golf\n', expectedOutput: '9\n' }, { input: 'abc\n', expectedOutput: '3\n' }],
  },
  {
    title: 'First Character', description: 'Read a non-empty word and print its first character.', inputDescription: 'One word.', outputDescription: 'The first character followed by a newline.', constraints: 'The word has 1 to 100 lowercase letters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'arena\n', expectedOutput: 'a\n' }, { input: 'zebra\n', expectedOutput: 'z\n' }],
  },
  {
    title: 'Last Character', description: 'Read a non-empty word and print its last character.', inputDescription: 'One word.', outputDescription: 'The last character followed by a newline.', constraints: 'The word has 1 to 100 lowercase letters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'arena\n', expectedOutput: 'a\n' }, { input: 'golf\n', expectedOutput: 'f\n' }],
  },
  {
    title: 'Uppercase Word', description: 'Read a lowercase word and print it in uppercase.', inputDescription: 'One lowercase word.', outputDescription: 'The uppercase word followed by a newline.', constraints: 'The word has 1 to 100 lowercase letters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'arena\n', expectedOutput: 'ARENA\n' }, { input: 'golf\n', expectedOutput: 'GOLF\n' }],
  },
  {
    title: 'Vowel Count', description: 'Read a lowercase word and print how many vowels it contains.', inputDescription: 'One lowercase word.', outputDescription: 'The vowel count followed by a newline.', constraints: 'The word has 1 to 100 lowercase letters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'arena\n', expectedOutput: '3\n' }, { input: 'rhythm\n', expectedOutput: '0\n' }],
  },
  {
    title: 'Sum from One to N', description: 'Read a positive integer N and print the sum from 1 through N.', inputDescription: 'One positive integer N.', outputDescription: 'The sum followed by a newline.', constraints: '1 <= N <= 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '5\n', expectedOutput: '15\n' }, { input: '1\n', expectedOutput: '1\n' }],
  },
  {
    title: 'Factorial', description: 'Read a non-negative integer N and print N factorial.', inputDescription: 'One integer N.', outputDescription: 'N factorial followed by a newline.', constraints: '0 <= N <= 12.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '5\n', expectedOutput: '120\n' }, { input: '0\n', expectedOutput: '1\n' }],
  },
  {
    title: 'Fizz Buzz', description: 'Read an integer. Print FizzBuzz if divisible by 15, Fizz if divisible by 3, Buzz if divisible by 5, otherwise print the number.', inputDescription: 'One integer.', outputDescription: 'The required value followed by a newline.', constraints: '1 <= N <= 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '15\n', expectedOutput: 'FizzBuzz\n' }, { input: '7\n', expectedOutput: '7\n' }],
  },
  {
    title: 'Positive Negative Zero', description: 'Read an integer and classify it as Positive, Negative, or Zero.', inputDescription: 'One integer.', outputDescription: 'The classification followed by a newline.', constraints: 'The integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '-1\n', expectedOutput: 'Negative\n' }, { input: '0\n', expectedOutput: 'Zero\n' }],
  },
  {
    title: 'Leap Year Check', description: 'Read a year and print Yes when it is a leap year; otherwise print No.', inputDescription: 'One year.', outputDescription: 'Yes or No followed by a newline.', constraints: '1 <= year <= 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '2024\n', expectedOutput: 'Yes\n' }, { input: '1900\n', expectedOutput: 'No\n' }],
  },
  {
    title: 'Minimum of Three', description: 'Read three integers and print the smallest value.', inputDescription: 'Three space-separated integers.', outputDescription: 'The smallest integer followed by a newline.', constraints: 'Each integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '3 9 5\n', expectedOutput: '3\n' }, { input: '-1 -7 -3\n', expectedOutput: '-7\n' }],
  },
  {
    title: 'Average of Three', description: 'Read three integers and print their integer average, rounded down.', inputDescription: 'Three space-separated non-negative integers.', outputDescription: 'The integer average followed by a newline.', constraints: 'Each integer is between 0 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '3 4 5\n', expectedOutput: '4\n' }, { input: '1 2 2\n', expectedOutput: '1\n' }],
  },
  {
    title: 'Swap Two Numbers', description: 'Read two integers and print them in swapped order.', inputDescription: 'Two space-separated integers.', outputDescription: 'The second integer, a space, then the first integer.', constraints: 'Each integer is between -1,000,000 and 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '2 9\n', expectedOutput: '9 2\n' }, { input: '-1 4\n', expectedOutput: '4 -1\n' }],
  },
  {
    title: 'Digit Sum', description: 'Read a non-negative integer and print the sum of its decimal digits.', inputDescription: 'One non-negative integer.', outputDescription: 'The digit sum followed by a newline.', constraints: '0 <= N <= 2,000,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '12345\n', expectedOutput: '15\n' }, { input: '0\n', expectedOutput: '0\n' }],
  },
  {
    title: 'Palindrome Word', description: 'Read a lowercase word and print Yes if it reads the same backwards, otherwise print No.', inputDescription: 'One lowercase word.', outputDescription: 'Yes or No followed by a newline.', constraints: 'The word has 1 to 100 lowercase letters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'level\n', expectedOutput: 'Yes\n' }, { input: 'arena\n', expectedOutput: 'No\n' }],
  },
  {
    title: 'Count Spaces', description: 'Read one line and print the number of space characters.', inputDescription: 'One line of text.', outputDescription: 'The space count followed by a newline.', constraints: 'The line has at most 1,000 characters.', supportedLanguages: sharedLanguages,
    testCases: [{ input: 'code golf arena\n', expectedOutput: '2\n' }, { input: 'nospace\n', expectedOutput: '0\n' }],
  },
  {
    title: 'Array Sum', description: 'Read N followed by N integers and print their sum.', inputDescription: 'N on the first line, then N space-separated integers.', outputDescription: 'The sum followed by a newline.', constraints: '1 <= N <= 100 and each value is between -10,000 and 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '4\n1 2 3 4\n', expectedOutput: '10\n' }, { input: '3\n-2 5 -1\n', expectedOutput: '2\n' }],
  },
  {
    title: 'Array Maximum', description: 'Read N followed by N integers and print the largest value.', inputDescription: 'N on the first line, then N space-separated integers.', outputDescription: 'The largest value followed by a newline.', constraints: '1 <= N <= 100 and each value is between -10,000 and 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '4\n1 8 3 2\n', expectedOutput: '8\n' }, { input: '3\n-2 -5 -1\n', expectedOutput: '-1\n' }],
  },
  {
    title: 'Array Minimum', description: 'Read N followed by N integers and print the smallest value.', inputDescription: 'N on the first line, then N space-separated integers.', outputDescription: 'The smallest value followed by a newline.', constraints: '1 <= N <= 100 and each value is between -10,000 and 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '4\n1 8 3 2\n', expectedOutput: '1\n' }, { input: '3\n-2 -5 -1\n', expectedOutput: '-5\n' }],
  },
  {
    title: 'Count Even Numbers', description: 'Read N followed by N integers and print how many are even.', inputDescription: 'N on the first line, then N space-separated integers.', outputDescription: 'The even-number count followed by a newline.', constraints: '1 <= N <= 100 and each value is between -10,000 and 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '5\n1 2 3 4 6\n', expectedOutput: '3\n' }, { input: '3\n1 3 5\n', expectedOutput: '0\n' }],
  },
  {
    title: 'Second Largest', description: 'Read N distinct integers and print the second largest value.', inputDescription: 'N on the first line, then N distinct space-separated integers.', outputDescription: 'The second largest value followed by a newline.', constraints: '2 <= N <= 100 and each value is between -10,000 and 10,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '4\n1 8 3 2\n', expectedOutput: '3\n' }, { input: '3\n-2 -5 -1\n', expectedOutput: '-2\n' }],
  },
  {
    title: 'GCD of Two Numbers', description: 'Read two positive integers and print their greatest common divisor.', inputDescription: 'Two space-separated positive integers.', outputDescription: 'The greatest common divisor followed by a newline.', constraints: '1 <= values <= 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '12 18\n', expectedOutput: '6\n' }, { input: '7 13\n', expectedOutput: '1\n' }],
  },
  {
    title: 'Prime Check', description: 'Read an integer greater than one and print Yes if it is prime, otherwise print No.', inputDescription: 'One integer.', outputDescription: 'Yes or No followed by a newline.', constraints: '2 <= N <= 1,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '29\n', expectedOutput: 'Yes\n' }, { input: '21\n', expectedOutput: 'No\n' }],
  },
  {
    title: 'Power of Two', description: 'Read a positive integer and print Yes if it is a power of two, otherwise print No.', inputDescription: 'One positive integer.', outputDescription: 'Yes or No followed by a newline.', constraints: '1 <= N <= 1,000,000,000.', supportedLanguages: sharedLanguages,
    testCases: [{ input: '64\n', expectedOutput: 'Yes\n' }, { input: '12\n', expectedOutput: 'No\n' }],
  },
];

try {
  await connectDatabase();
  for (const problem of problems) {
    await Problem.updateOne({ title: problem.title }, { $set: problem }, { upsert: true, runValidators: true });
  }
  console.info(`Seeded ${problems.length} problems.`);
} finally {
  await mongoose.disconnect();
}
