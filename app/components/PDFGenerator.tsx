"use client";

import { useState } from "react";
import { Question } from "@/types";
import { jsPDF } from "jspdf";

interface PDFGeneratorProps {
  questions: Question[];
  displayAttributes: string[];
}

export default function PDFGenerator({ questions, displayAttributes }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  // Helper to wrap text
  const wrapText = (text: string, pdf: jsPDF, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testWidth = pdf.getTextWidth(testLine);

      if (testWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  };

  // Helper to load images
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Handle CORS issues
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  // Main function to generate the PDF
  const generatePDF = async () => {
    setIsGenerating(true);
    const pdf = new jsPDF();
    let yPosition = 20; // Vertical position tracker
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;

    try {
      let questionCounter = 1; // Start counter from 1

      for (const question of questions) {
        // Add title with incrementing question number only
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        const questionTitle = `Question ${questionCounter}`; // Only display Question X
        pdf.text(questionTitle, margin, yPosition);
        questionCounter += 1; // Increment the counter
        yPosition += 10;

        // Add question content (image only if exists)
        if (
          displayAttributes.includes("content") &&
          question.imageUrls &&
          question.imageUrls.length > 0
        ) {
          const imageUrl = question.imageUrls[0];
          try {
            const img = await loadImage(imageUrl);
            const imgAspectRatio = img.height / img.width;
            const imgWidth = Math.min(maxWidth, 140); // Limit image width
            const imgHeight = imgWidth * imgAspectRatio;

            // Add new page if image doesn't fit
            if (yPosition + imgHeight > pageHeight - margin) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.addImage(img, "JPEG", margin, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight;
          } catch (error) {
            console.error("Error loading image:", error);
            pdf.setFontSize(12);
            pdf.setTextColor(255, 0, 0);
            pdf.text("Error loading image", margin, yPosition);
            yPosition += 10;
          }
        }

        // Add additional attributes
        yPosition += 10;
        Object.entries(question).forEach(([key, value]) => {
          if (
            key !== "content" &&
            key !== "solution" &&
            key !== "imageUrls" &&
            displayAttributes.includes(key)
          ) {
            if (yPosition > pageHeight - 30) {
              pdf.addPage();
              yPosition = 20;
            }

            pdf.setFontSize(10);
            pdf.setFont("helvetica", "bold");
            pdf.text(`${key}:`, margin, yPosition);
            pdf.setFont("helvetica", "normal");
            const valueText = Array.isArray(value) ? value.join(", ") : String(value);
            const valueLines = wrapText(valueText, pdf, maxWidth - 30);
            valueLines.forEach((line, lineIndex) => {
              pdf.text(line, margin + 30, yPosition + lineIndex * 5);
            });
            yPosition += valueLines.length * 5 + 5;
          }
        });

        // Add a new page for the next question
        pdf.addPage();
        yPosition = 20;
      }

      pdf.save("exam_questions.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={generatePDF}
        disabled={isGenerating || questions.length === 0}
        className="px-4 py-2 font-semibold text-white bg-green-500 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? "Generating PDF..." : "Generate PDF"}
      </button>
    </div>
  );
}
