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
  if (!jsonData || !Array.isArray(jsonData.Questions)) {
    console.error('Invalid JSON structure. Ensure the "Questions" key contains an array of questions.');
    return;
  }

  for (const question of jsonData.Questions) {
    const { Metadata, QuestionContent, SolutionContent } = question;

    // Handle structured parts of questions and solutions
    const structuredQuestionParts =
      QuestionContent.Parts.length > 0
        ? QuestionContent.Parts.map((part) => ({
            questionText: QuestionContent.Text || '',
            part: part.Part,
            question: part.Question,
          }))
        : [
            {
              questionText: QuestionContent.Text || '',
              part: 'n/a', // Placeholder for missing parts
              question: 'No parts provided.', // Default message
            },
          ];

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
          level: Metadata.Level || '',
          mathTopic: Metadata.MathTopic || '',
          difficulty: Metadata.DifficultyLevel || null,
          topicsCovered: Metadata.TopicsCovered || [],
          marksAllocation: Metadata.MarksAllocation, // Directly use as it is a JSON object
          imageUrls: Metadata.ImageUrl || [],
        },
      });

      console.log(`Successfully inserted question: ${Metadata.QuestionTitle}`);
    } catch (error) {
      console.error(`Error inserting question "${Metadata.QuestionTitle}":`, error.message);
    }
  }
}

main()
  .catch((e) => console.error('Fatal error:', e))
  .finally(() => prisma.$disconnect());
