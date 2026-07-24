// Standalone smoke test for the public Judge0 CE endpoint using Python 3 (language ID 71).
import { executeCode } from './src/services/judge0.js';

const runJudge0Test = async () => {
  try {
    const result = await executeCode({
      sourceCode: 'print("Hello from Judge0")',
      languageId: 71,
    });

    console.log('Judge0 execution result:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Judge0 test failed:', error.message);
    process.exitCode = 1;
  }
};

runJudge0Test();
