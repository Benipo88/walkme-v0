'use client'

import { useState, useMemo } from 'react'
import ArticleList from './ArticleList'
import ArticleDetail from './ArticleDetail'
import ArticleEditor from './ArticleEditor'
import SearchBar from './SearchBar'
import { Button } from './ui/button'
import { FilePlus2 } from 'lucide-react'

export interface Article {
  id: string
  title: string
  description: string
  content: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export default function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      title: 'ユーザーガイドへようこそ',
      description: 'WalkMeナレッジベースの使い方を学びます',
      content: 'これは最初のテスト記事です。記事の内容がここに表示されます。',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'ナビゲーションの基本',
      description: 'インターフェースをナビゲートする方法',
      content: 'ナビゲーションに関する詳細情報。',
      createdAt: new Date('2024-01-16'),
      updatedAt: new Date('2024-01-16'),
    },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticleId, setSelectedArticleId] = useState<string>('1')
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // フィルタリングと検索ロジック
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles

    const query = searchQuery.toLowerCase()
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query)
    )
  }, [articles, searchQuery])

  const selectedArticle = articles.find((a) => a.id === selectedArticleId)

  const handleSaveArticle = (article: Article) => {
    if (article.id === 'new') {
      // 新規記事として保存
      const newArticle: Article = {
        ...article,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setArticles([newArticle, ...articles])
      setSelectedArticleId(newArticle.id)
    } else {
      // 既存記事を更新
      setArticles(
        articles.map((a) => (a.id === article.id ? { ...article, updatedAt: new Date() } : a))
      )
    }
    setIsCreatingNew(false)
    setEditingArticle(null)
  }

  const handleDeleteArticle = (articleId: string) => {
    const newArticles = articles.filter((a) => a.id !== articleId)
    setArticles(newArticles)
    if (selectedArticleId === articleId && newArticles.length > 0) {
      setSelectedArticleId(newArticles[0].id)
    }
  }

  const handleNewArticle = () => {
    setIsCreatingNew(true)
    setEditingArticle(null)
  }

  const handleEditArticle = () => {
    if (selectedArticle) {
      setEditingArticle({ ...selectedArticle })
      setIsCreatingNew(false)
    }
  }

  const handleCancelEdit = () => {
    setIsCreatingNew(false)
    setEditingArticle(null)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ヘッダー */}
      <header className="border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <h1 className="text-2xl font-semibold text-foreground">WalkMe Knowledge Base</h1>
          </div>
          <Button
            onClick={handleNewArticle}
            aria-label="記事を作成"
            className="border-none rounded-[12px] bg-[linear-gradient(135deg,_#c19a6b,_#a67c52,_#8b6542)] font-bold shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_3px_6px_rgba(0,0,0,0.3)] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.4)]"
          >
            <FilePlus2 size={18} />
          </Button>
        </div>

        {/* 検索バー */}
        <div className="px-6 pb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="flex flex-1 overflow-hidden">
        {/* 左サイドバー */}
        <aside className="w-80 border-r border-border bg-sidebar overflow-y-auto">
          <ArticleList
            articles={filteredArticles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={setSelectedArticleId}
          />
        </aside>

        {/* 右メインエリア */}
        <main className="flex-1 overflow-y-auto bg-background">
          {isCreatingNew || editingArticle ? (
            <ArticleEditor
              article={editingArticle}
              onSave={handleSaveArticle}
              onCancel={handleCancelEdit}
            />
          ) : selectedArticle ? (
            <ArticleDetail
              article={selectedArticle}
              onEdit={handleEditArticle}
              onDelete={() => handleDeleteArticle(selectedArticle.id)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>記事を選択してください</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
