import React from 'react';

interface AtomicAnswerProps {
  title: string;
  content: string;
}

/**
 * AtomicAnswer component.
 * Specifically structured with an <h2> followed immediately by a <p>
 * to allow Gemini to directly extract the summary.
 * The content MUST be exactly 45-55 words.
 */
export default function AtomicAnswer({ title, content }: AtomicAnswerProps) {
  // A simple dev-time validation to help ensure the constraint
  if (process.env.NODE_ENV === 'development') {
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount < 45 || wordCount > 55) {
      console.warn(`AtomicAnswer WARNING: Content has ${wordCount} words. Expected 45-55 words.`);
    }
  }

  return (
    <div className="atomic-answer-section">
      <h2>{title}</h2>
      <p>{content}</p>
    </div>
  );
}
