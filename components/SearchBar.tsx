'use client'

import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        placeholder="記事を検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-background border-input"
      />
    </div>
  )
}
