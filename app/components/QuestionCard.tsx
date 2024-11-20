import { Question } from '@/types';
var Latex = require("react-latex");

interface QuestionCardProps {
  question: Question;
  displayAttributes: string[];
  onDelete: (id: number) => void;
}

export default function QuestionCard({ question, displayAttributes, onDelete }: QuestionCardProps) {
  return (
    <div className="p-4 border rounded shadow-sm bg-white mb-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg mb-2">{question.title}</h2>
        <button
          onClick={() => onDelete(question.id)}
          className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
      <div className="mb-4">
        <div>
          {question.imageUrls && question.imageUrls.length > 0 && (
            <>
              <strong>Images:</strong>
              <div className="flex flex-wrap gap-4 mt-2">
                {question.imageUrls.map((url, idx) => (
                  <div key={idx} className="w-1/4">
                    <img
                      src={url}
                      alt={`Image ${idx + 1}`}
                      className="rounded-lg border shadow"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        {(displayAttributes.length === 0 || displayAttributes.includes('content')) && (
          <>
            <strong>Question:</strong>
            <div className="mt-2">
              <Latex>
                {JSON.parse(question.content)[0]?.questionText.replace(/\\\\/g, "\\")}
              </Latex>
            </div>
            <ul className="list-disc pl-6">
              {JSON.parse(question.content).map(
                (part: { part: string; question: string }, index: number) => (
                  <li key={index} className="mb-2">
                    <strong>Part {part.part.toUpperCase()}:</strong>{" "}
                    <Latex>{part.question.replace(/\\\\/g, "\\")}</Latex>
                  </li>
                )
              )}
            </ul>
          </>
        )}
      </div>
      {(displayAttributes.length === 0 || displayAttributes.includes('solution')) && (
        <div className="mb-4">
          <strong>Solution:</strong>
          <ul className="list-disc pl-6">
            {JSON.parse(question.solution).map(
              (solution: {
                part: string;
                solution: string;
                markingScheme: string;
              }, index: number) => (
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
          key !== 'content' &&
          key !== 'solution' &&
          (displayAttributes.length === 0 || displayAttributes.includes(key))
        ) {
          return (
            <p key={key}>
              <strong>{key}:</strong>{" "}
              {key === 'marksAllocation' ? (
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