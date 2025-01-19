import { Button } from "@/components/ui/button"
import { Users, Crown, Image } from 'lucide-react'

interface SuggestedQuestionsProps {
  onSelectQuestion: (question: string) => void
}

const suggestions = [
  {
    text: "Danh sách khoá D22",
    icon: Users,
    color: "text-blue-500",
  },
  {
    text: "Leader team web khoá 2024 là ai?",
    icon: Crown,
    color: "text-yellow-500",
  },
  {
    text: "Xem ảnh thành viên",
    icon: Image,
    color: "text-green-500",
  }
]

export function SuggestedQuestions({ onSelectQuestion }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-col space-y-2 w-full">
      {suggestions.map((suggestion, index) => {
        const Icon = suggestion.icon
        return (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start h-10 px-4 bg-white hover:bg-gray-100 dark:bg-[#141414] dark:hover:bg-[#1a1a1a] border-gray-200 dark:border-zinc-800"
            onClick={() => onSelectQuestion(suggestion.text)}
          >
            <Icon className={`w-4 h-4 mr-2 ${suggestion.color}`} />
            <span>{suggestion.text}</span>
          </Button>
        )
      })}
    </div>
  )
}

