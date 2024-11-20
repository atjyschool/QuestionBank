import { AttributeOption } from './types';

export const examBoards: AttributeOption[] = [
  { label: "CAIE", value: "CAIE" },
  { label: "Edexcel", value: "Edexcel" },
  { label: "AQA", value: "AQA" },
];

export const syllabusCodes: AttributeOption[] = [
  { label: "9709", value: "9709" },
  { label: "9231", value: "9231" },
  { label: "8MA0", value: "8MA0" },
];

export const years: AttributeOption[] = Array.from({ length: 10 }, (_, i) => ({
  label: `${2015 + i}`,
  value: `${2015 + i}`,
}));

export const sessions: AttributeOption[] = [
  { label: "June", value: "June" },
  { label: "November", value: "November" },
  { label: "March", value: "March" },
];

export const paperNumbers: AttributeOption[] = [
  { label: "Paper 1", value: "Paper 1" },
  { label: "Paper 2", value: "Paper 2" },
  { label: "Paper 3", value: "Paper 3" },
];

export const level: AttributeOption[] = [
  { label: "P1", value: "P1" },
  { label: "P2", value: "P2" },
  { label: "P3", value: "P3" },
];

export const questionTypes: AttributeOption[] = [
  { label: "Structured Question", value: "Structured Question" },
  { label: "Multiple Choice", value: "Multiple Choice" },
  { label: "Short Answer", value: "Short Answer" },
];

export const mathTopics: AttributeOption[] = [
  { label: "Algebra", value: "Algebra" },
  { label: "Differentiation", value: "Differentiation" },
  { label: "Trigonometry", value: "Trigonometry" },
  { label: "Integration", value: "Integration" },
  { label: "Quadratics", value: "Quadratics" },
  { label: "Circular measure", value: "Circular measure" },
  { label: "Coordinate geometry", value: "Coordinate geometry" },
];

export const difficulties: AttributeOption[] = [
  { label: "Easy", value: "Easy" },
  { label: "Moderate", value: "Moderate" },
  { label: "Hard", value: "Hard" },
];

export const attributeOptions: AttributeOption[] = [
  { label: "Question", value: "content" },
  { label: "Solution", value: "solution" },
  { label: "Exam Board", value: "examBoard" },
  { label: "Syllabus Code", value: "syllabusCode" },
  { label: "Year of Exam", value: "yearOfExam" },
  { label: "Session", value: "session" },
  { label: "Paper Number", value: "paperNumber" },
  { label: "Question Number", value: "questionNumber" },
  { label: "Question Type", value: "questionType" },
  { label: "Level", value: "level" },
  { label: "Math Topic", value: "mathTopic" },
  { label: "Difficulty", value: "difficulty" },
];