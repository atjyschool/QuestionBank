export interface Question {
    id: number;
    title: string;
    content: string;
    solution: string;
    examBoard: string;
    syllabusCode: string;
    yearOfExam: number;
    session: string;
    paperNumber: string;
    questionNumber: number;
    questionType: string;
    level: string;
    mathTopic: string;
    difficulty?: string;
    topicsCovered: string[];
    marksAllocation: Record<string, number>;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface AttributeOption {
    label: string;
    value: string;
  }