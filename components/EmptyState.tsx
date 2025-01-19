import React from 'react'
import { InputField } from './InputField'
import { SuggestedQuestions } from './SuggestedQuestions'

interface EmptyStateProps {
  input: string
  setInput: (input: string) => void
  handleSend: () => void
  isLoading: boolean
  handleSelectQuestion: (question: string) => void
}

export function EmptyState({ input, setInput, handleSend, isLoading, handleSelectQuestion }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 max-w-3xl mx-auto w-full">
      <h2 className="text-2xl sm:text-4xl font-bold mb-6 sm:mb-12 text-center">Tôi có thể hỗ trợ gì?</h2>
      <div className="w-full mb-6 sm:mb-8 max-w-lg sm:max-w-2xl">
        <InputField input={input} setInput={setInput} handleSend={handleSend} isLoading={isLoading} />
      </div>
      <div className="w-full max-w-md space-y-2">
        <SuggestedQuestions onSelectQuestion={handleSelectQuestion} />
      </div>
    </div>
  )
}

