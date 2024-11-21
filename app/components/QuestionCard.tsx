import { Question } from "@/types";
var Latex = require("react-latex");

interface QuestionCardProps {
  question: Question;
  displayAttributes: string[];
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
  isSelected: boolean;
}

export default function QuestionCard({
  question,
  displayAttributes,
  onDelete,
  onSelect,
  isSelected,
}: QuestionCardProps) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <input
            type="checkbox"
            id={`select-question-${question.id}`}
            checked={isSelected}
            onChange={() => onSelect(question.id)}
            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <h2 className="font-semibold text-lg">{question.title}</h2>
        </div>
        <button
          onClick={() => onDelete(question.id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <div className="mb-4">
        {(displayAttributes.length === 0 ||
          displayAttributes.includes("content")) && (
          <>
            <strong>Question:</strong>
            <div className="mt-2">
              {question.imageUrls && question.imageUrls.length > 0 && (
                <img
                  src={question.imageUrls[0]}
                  alt="Question content"
                  className="rounded-lg border shadow max-w-[700px] h-auto" // 设置最大宽度
                />
              )}
            </div>
          </>
        )}
      </div>
      {(displayAttributes.length === 0 ||
        displayAttributes.includes("solution")) && (
        <div className="mb-4">
          <strong>Solution:</strong>
          <ul className="list-disc pl-6">
            {JSON.parse(question.solution).map(
              (
                solution: {
                  part: string;
                  solution: string;
                  markingScheme: string;
                },
                index: number
              ) => (
                <li key={index} className="mb-2">
                  <strong>Part {solution.part.toUpperCase()}:</strong>{" "}
                  <Latex>{solution.solution.replace(/\\\\/g, "\\")}</Latex>
                  <div className="text-gray-600 text-sm">
                    <strong>Marking Scheme:</strong>
                    <Latex>{solution.markingScheme}</Latex>
                  </div>
                </li>
              )
            )}
          </ul>
        </div>
      )}
      {Object.entries(question).map(([key, value]) => {
        if (
          key !== "content" &&
          key !== "solution" &&
          (displayAttributes.length === 0 || displayAttributes.includes(key))
        ) {
          return (
            <p key={key}>
              <strong>{key}:</strong>{" "}
              {key === "marksAllocation" ? (
                <Latex>{JSON.stringify(value, null, 2)}</Latex>
              ) : Array.isArray(value) ? (
                value.join(", ")
              ) : (
                String(value)
              )}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}
