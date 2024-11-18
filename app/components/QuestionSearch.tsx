'use client'

import { useState } from "react"
var Latex = require("react-latex");
import "katex/dist/katex.min.css";

interface Part {
  part: string
  question: string
}

interface SolutionPart {
  part: string
  solution: string
  markingScheme: string
}

interface Question {
  id: number
  title: string
  content: string  
  solution: string 
  examBoard: string
  syllabusCode: string
  yearOfExam: number
  session: string
  paperNumber: string
  questionNumber: number
  questionType: string
  mathTopic: string
  difficulty?: string
  topicsCovered: string[]
  marksAllocation: Record<string, number>
  imageUrls: string[]
  createdAt: string
  updatedAt: string
}

export default function QuestionSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [searchResults, setSearchResults] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/search_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, topic, difficulty }),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch search results')
      }
      const data = await response.json()
      setSearchResults(data)
    } catch (err) {
      setError('An error occurred while searching. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const renderQuestionContent = (question: Question) => (
    <div key={question.id} className="p-4 border rounded shadow-sm bg-white">
      <h2 className="font-semibold text-lg mb-2">{question.title}</h2>
      <div className="mb-4">
        <strong>Content:</strong>
        <ul>
          {(() => {
            try {
              const parts = JSON.parse(question.content) as Part[]
              return parts.map((part, idx) => (
                <li key={idx}>
                  <strong>Part {part.part}:</strong> <Latex>{part.question}</Latex>
                </li>
              ))
            } catch (e) {
              return <li>Error displaying parts</li>
            }
          })()}
        </ul>
      </div>
      <div className="mb-4">
        <strong>Solution:</strong>
        <ul>
          {(() => {
            try {
              const solutions = JSON.parse(question.solution) as SolutionPart[]
              return solutions.map((part, idx) => (
                <li key={idx}>
                  <strong>Part {part.part}:</strong> <Latex>{part.solution}</Latex>
                  <br />
                  <strong>Marking Scheme:</strong> <Latex>{part.markingScheme}</Latex>
                </li>
              ))
            } catch (e) {
              return <li>Error displaying solutions</li>
            }
          })()}
        </ul>
      </div>
      <p><strong>Exam Board:</strong> {question.examBoard}</p>
      <p><strong>Syllabus Code:</strong> {question.syllabusCode}</p>
      <p><strong>Year of Exam:</strong> {question.yearOfExam}</p>
      <p><strong>Session:</strong> {question.session}</p>
      <p><strong>Paper Number:</strong> {question.paperNumber}</p>
      <p><strong>Question Number:</strong> {question.questionNumber}</p>
      <p><strong>Question Type:</strong> {question.questionType}</p>
      <p><strong>Math Topic:</strong> {question.mathTopic}</p>
      <p><strong>Difficulty:</strong> {question.difficulty || "N/A"}</p>
      <p><strong>Topics Covered:</strong> {question.topicsCovered.join(", ")}</p>
      <p><strong>Marks Allocation:</strong> <Latex>{JSON.stringify(question.marksAllocation)}</Latex></p>
      <p><strong>Images:</strong> 
        {question.imageUrls.map((url, idx) => (
          <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mr-2">
            Image {idx + 1}
          </a>
        ))}
      </p>
      <p><small>Created At: {new Date(question.createdAt).toLocaleString()}</small></p>
      <p><small>Updated At: {new Date(question.updatedAt).toLocaleString()}</small></p>
    </div>
  )

  return (
    <div>
      <div className="mb-4 space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <input
            type="text"
            placeholder="Search questions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search questions"
          />
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select topic"
          >
            <option value="">Select topic</option>
            <option value="Algebra">Algebra</option>
            <option value="Integration">Geometry</option>
            <option value="calculus">Calculus</option>
          </select>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Select difficulty"
          >
            <option value="">Select difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Hard">Hard</option>
          </select>
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid gap-4">
        {searchResults.length > 0 ? (
          searchResults.map(renderQuestionContent)
        ) : (
          <p>No questions found. Please perform a search.</p>
        )}
      </div>
    </div>
  )
}