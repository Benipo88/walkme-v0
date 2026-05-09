'use client'

import { Article } from './KnowledgeBase'
import { Button } from './ui/button'
import { Edit2, Trash2 } from 'lucide-react'

interface ArticleDetailProps {
  article: Article
  onEdit: () => void
  onDelete: () => void
}

export default function ArticleDetail({ article, onEdit, onDelete }: ArticleDetailProps) {
  return (
    <div className="h-full flex flex-col">
      {/* 記事ヘッダー */}
      <div className="border-b border-border bg-card p-6 flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-foreground mb-2">{article.title}</h1>
          <p className="text-muted-foreground">{article.description}</p>
          <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
            <time>作成: {new Date(article.createdAt).toLocaleDateString('ja-JP')}</time>
            <time>更新: {new Date(article.updatedAt).toLocaleDateString('ja-JP')}</time>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onEdit}
            title="編集"
            className="border-none rounded-[12px] bg-[linear-gradient(135deg,_#c19a6b,_#a67c52,_#8b6542)] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
          >
            <Edit2 size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (confirm('この記事を削除してもよろしいですか？')) {
                onDelete()
              }
            }}
            aria-label="削除"
            title="削除"
            className="border-none rounded-[12px] bg-[linear-gradient(135deg,_#5c3d2e,_#4a2f20,_#3d2517)] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] hover:text-white"
          >
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      {/* 画像 */}
      {article.image && (
        <div className="p-6 border-b border-border">
          <img
            src={article.image}
            alt={article.title}
            className="max-w-2xl h-auto rounded-lg object-cover"
          />
        </div>
      )}

      {/* コンテンツ */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl prose prose-sm">
          <div className="text-foreground whitespace-pre-wrap leading-relaxed">
            {article.content}
          </div>
        </div>
      </div>
    </div>
  )
}
