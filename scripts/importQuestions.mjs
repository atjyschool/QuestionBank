import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const jsonFilePath = './public/QuestionBank.json';

  if (!fs.existsSync(jsonFilePath)) {
    console.error(`File not found: ${jsonFilePath}`);
    return;
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

  // Ensure the JSON is structured as expected
  if (!jsonData || !jsonData.Question || !jsonData.Question.Metadata) {
    console.error('Invalid JSON structure. Ensure the file matches the expected format.');
    return;
  }

  const { Metadata, QuestionContent, SolutionContent } = jsonData.Question;

  // Handle structured parts of questions and solutions
  const structuredQuestionParts = QuestionContent.Parts.map((part) => ({
    part: part.Part,
    question: part.Question,
  }));

  const structuredSolutionParts = SolutionContent.Parts.map((part) => ({
    part: part.Part,
    solution: part.Solution,
    markingScheme: part.MarkingScheme,
  }));

  try {
    // Insert the question into the database
    await prisma.question.create({
      data: {
        title: Metadata.QuestionTitle || 'Untitled Question',
        content: JSON.stringify(structuredQuestionParts),
        solution: JSON.stringify(structuredSolutionParts),
        examBoard: Metadata.ExamBoard || '',
        syllabusCode: Metadata.SyllabusCode || '',
        yearOfExam: Metadata.YearOfExam || null,
        session: Metadata.Session || '',
        paperNumber: Metadata.PaperNumber || '',
        questionNumber: Metadata.QuestionNumber || null,
        questionType: Metadata.QuestionType || '',
        mathTopic: Metadata.MathTopic || '',
        difficulty: Metadata.DifficultyLevel || null,
        topicsCovered: Metadata.TopicsCovered || [],
        marksAllocation: Metadata.MarksAllocation, // Directly use as it is a JSON object
        imageUrls: Metadata.ImageUrl || [],
      },
    });

    console.log(`Successfully inserted question: ${Metadata.QuestionTitle}`);
  } catch (error) {
    console.error('Error inserting question:', error.message);
  }
}

main()
  .catch((e) => console.error('Fatal error:', e))
  .finally(() => prisma.$disconnect());
