'use client'

import { Article } from './KnowledgeBase'
import { cn } from '@/lib/utils'

interface ArticleListProps {
  articles: Article[]
  selectedArticleId: string
  onSelectArticle: (id: string) => void
}

export default function ArticleList({
  articles,
  selectedArticleId,
  onSelectArticle,
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p>該当する記事がありません</p>
      </div>
    )
  }

  return (
    <div className="p-3">
      {articles.map((article) => (
        <button
          key={article.id}
          onClick={() => onSelectArticle(article.id)}
          className={cn(
            'w-full text-left p-4 rounded-lg mb-2 transition-colors border border-transparent',
            selectedArticleId === article.id
              ? 'bg-accent bg-opacity-10 border-accent text-foreground'
              : 'hover:bg-muted text-foreground'
          )}
        >
          <h3 className="font-medium text-sm line-clamp-2">{article.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {article.description}
          </p>
          <time className="text-xs text-muted-foreground mt-2 block">
            {new Date(article.updatedAt).toLocaleDateString('ja-JP')}
          </time>
        </button>
      ))}
    </div>
  )
}
