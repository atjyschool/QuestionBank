import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { searchTerm, topic, difficulty } = await request.json()

    // Validate input values (optional but recommended for robustness)
    if (
      (searchTerm && typeof searchTerm !== 'string') ||
      (topic && typeof topic !== 'string') ||
      (difficulty && typeof difficulty !== 'string')
    ) {
      return NextResponse.json(
        { error: 'Invalid input data. Ensure all inputs are strings.' },
        { status: 400 }
      )
    }

    // Fetch questions from the database
    const questions = await prisma.question.findMany({
      where: {
        AND: [
          searchTerm
            ? {
                OR: [
                  { title: { contains: searchTerm, mode: 'insensitive' } },
                  { content: { contains: searchTerm, mode: 'insensitive' } },
                ],
              }
            : {},
          topic ? { mathTopic: { equals: topic, mode: 'insensitive' } } : {},
          difficulty ? { difficulty: { equals: difficulty } } : {},
        ],
      },
      take: 20,
    })

    // Return the results as JSON
    return NextResponse.json(questions)
  } catch (error) {
    console.error('Error processing search:', error)

    // Return a 500 error response
    return NextResponse.json(
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
