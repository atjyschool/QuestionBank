"use client";

import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
var Latex = require("react-latex");
import "katex/dist/katex.min.css";
import { Question, AttributeOption } from '@/types';
import { examBoards, syllabusCodes, years, sessions, paperNumbers, questionTypes, level, mathTopics, difficulties, attributeOptions } from '@/constants';
import QuestionCard from './QuestionCard';
import PDFGenerator from './PDFGenerator'


export default function QuestionSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string[]>
  >({
    examBoard: [],
    syllabusCode: [],
    yearOfExam: [],
    session: [],
    paperNumber: [],
    questionType: [],
    level: [],
    mathTopic: [],
    difficulty: [],
  });
  const [searchResults, setSearchResults] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayAttributes, setDisplayAttributes] = useState<string[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);

  const handleAttributeChange = (category: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [category]: prev[category as keyof typeof prev].includes(value)
        ? prev[category as keyof typeof prev].filter((item) => item !== value)
        : [...prev[category as keyof typeof prev], value],
    }));
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/search_questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ searchTerm, selectedAttributes }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this question?")) return;

    try {
      const response = await fetch(`/api/search_questions?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the question.");
      }

      setSearchResults((prev) => prev.filter((q) => q.id !== id));
      alert("Question deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("An error occurred while deleting the question.");
    }
  };

  const handleDisplayAttributeToggle = (attribute: string) => {
    setDisplayAttributes(prev =>
      prev.includes(attribute)
        ? prev.filter(a => a !== attribute)
        : [...prev, attribute]
    );
  };

  const handleQuestionSelect = (id: number) => {
    setSelectedQuestions(prev =>
      prev.includes(id)
        ? prev.filter(qId => qId !== id)
        : [...prev, id]
    );
  };

  const renderAttributeSelector = (
    category: string,
    options: AttributeOption[]
  ) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {category}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={`${category}-${option.value}`}
              checked={(
                selectedAttributes[
                  category as keyof typeof selectedAttributes
                ] as string[]
              ).includes(option.value)}
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
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Question Search</h1>
      <div className="mb-4">
        <label
          htmlFor="searchTerm"
          className="block text-sm font-medium text-gray-700"
        >
          Search questions:
        </label>
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
        {renderAttributeSelector("level", level)}
        {renderAttributeSelector("mathTopic", mathTopics)}
        {renderAttributeSelector("difficulty", difficulties)}
      </div>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Select attributes to display:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {attributeOptions.map(attr => (
            <div key={attr.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`display-${attr.value}`}
                checked={displayAttributes.includes(attr.value)}
                onChange={() => handleDisplayAttributeToggle(attr.value)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor={`display-${attr.value}`}
                className="text-sm font-medium text-gray-700"
              >
                {attr.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handleSearch}
        disabled={isLoading}
        className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        {isLoading ? "Searching..." : "Search"}
      </button>
      
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <PDFGenerator
              questions={searchResults.filter(q => selectedQuestions.includes(q.id))}
              displayAttributes={displayAttributes}
      />
      <div className="mt-8">
        {searchResults.length > 0 ? (
          searchResults.map(question => (
            <QuestionCard
            key={question.id}
            question={question}
            displayAttributes={displayAttributes}
            onDelete={handleDelete}
            onSelect={handleQuestionSelect}
            isSelected={selectedQuestions.includes(question.id)}
            />
          ))
        ) : (
          <p>No questions found. Please perform a search.</p>
        )}
      </div>
    </div>
  );
}