import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { searchTerm, selectedAttributes } = body;

  let whereClause: any = {};

  // Add text search condition
  if (searchTerm) {
    whereClause.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { content: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  // Add conditions for each attribute
  for (const [attribute, values] of Object.entries(selectedAttributes)) {
    if (Array.isArray(values) && values.length > 0) {
      switch (attribute) {
        case 'yearOfExam':
          whereClause[attribute] = { in: values.map(Number) };
          break;
        case 'topicsCovered':
          whereClause[attribute] = { hasSome: values };
          break;
        default:
          whereClause[attribute] = { in: values };
      }
    }
  }

  try {
    const questions = await prisma.question.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error searching questions:', error);
    return NextResponse.json({ error: 'An error occurred while searching questions' }, { status: 500 });
  }
}