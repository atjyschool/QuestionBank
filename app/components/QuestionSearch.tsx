'use client'

import { useState } from "react"
var Latex = require("react-latex")
import "katex/dist/katex.min.css"

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

interface AttributeOption {
  label: string
  value: string
}

const examBoards: AttributeOption[] = [
  { label: "CAIE", value: "CAIE" },
  { label: "Edexcel", value: "Edexcel" },
  { label: "AQA", value: "AQA" },
]

const syllabusCodes: AttributeOption[] = [
  { label: "9709", value: "9709" },
  { label: "9231", value: "9231" },
  { label: "8MA0", value: "8MA0" },
]

const years: AttributeOption[] = Array.from({ length: 10 }, (_, i) => ({
  label: `${2015 + i}`,
  value: `${2015 + i}`,
}))

const sessions: AttributeOption[] = [
  { label: "June", value: "June" },
  { label: "November", value: "November" },
  { label: "March", value: "March" },
]

const paperNumbers: AttributeOption[] = [
  { label: "Paper 1", value: "Paper 1" },
  { label: "Paper 2", value: "Paper 2" },
  { label: "Paper 3", value: "Paper 3" },
]

const questionTypes: AttributeOption[] = [
  { label: "Structured Question", value: "Structured Question" },
  { label: "Multiple Choice", value: "Multiple Choice" },
  { label: "Short Answer", value: "Short Answer" },
]

const mathTopics: AttributeOption[] = [
  { label: "Algebra", value: "Algebra" },
  { label: "Calculus", value: "Calculus" },
  { label: "Geometry", value: "Geometry" },
  { label: "Statistics", value: "Statistics" },
]

const difficulties: AttributeOption[] = [
  { label: "Easy", value: "Easy" },
  { label: "Moderate", value: "Moderate" },
  { label: "Hard", value: "Hard" },
]

export default function QuestionSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string[]>>({
    examBoard: [],
    syllabusCode: [],
    yearOfExam: [],
    session: [],
    paperNumber: [],
    questionType: [],
    mathTopic: [],
    difficulty: [],
  })
  const [searchResults, setSearchResults] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAttributeChange = (category: string, value: string) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(value)
        ? prev[category as keyof typeof prev].filter(item => item !== value)
        : [...prev[category as keyof typeof prev], value]
    }))
  }

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/search_questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchTerm, selectedAttributes }),
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

  const renderAttributeSelector = (category: string, options: AttributeOption[]) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{category}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${category}-${option.value}`}
              checked={(selectedAttributes[category as keyof typeof selectedAttributes] as string[]).includes(option.value)}
              onChange={() => handleAttributeChange(category, option.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor={`${category}-${option.value}`}
              className="text-sm font-medium text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )

  const renderQuestionContent = (question: Question) => (
    <div key={question.id} className="p-4 border rounded shadow-sm bg-white mb-4">
      <h2 className="font-semibold text-lg mb-2">{question.title}</h2>
      <div className="mb-4">
        <strong>Content:</strong>
        <Latex>{question.content.replace(/\\\\/g, "\\")}</Latex>
      </div>
      <div className="mb-4">
        <strong>Solution:</strong>
        <Latex>{question.solution.replace(/\\\\/g, "\\")}</Latex>
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
      <p><strong>Marks Allocation:</strong> <Latex>{JSON.stringify(question.marksAllocation, null, 2)}</Latex></p>
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
  );
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Search</h1>
      <div className="mb-4">
        <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700">Search questions:</label>
        <input
          id="searchTerm"
          type="text"
          placeholder="e.g., cubic equation"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {renderAttributeSelector("examBoard", examBoards)}
        {renderAttributeSelector("yearOfExam", years)}
        {renderAttributeSelector("session", sessions)}
        {renderAttributeSelector("paperNumber", paperNumbers)}
        {renderAttributeSelector("questionType", questionTypes)}
        {renderAttributeSelector("mathTopic", mathTopics)}
        {renderAttributeSelector("difficulty", difficulties)}
      </div>
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-8">
        {searchResults.length > 0 ? (
          searchResults.map(renderQuestionContent)
        ) : (
          <p>No questions found. Please perform a search.</p>
        )}
      </div>
    </div>
  )
}