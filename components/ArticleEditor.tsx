'use client'

import { useState, useRef } from 'react'
import { Article } from './KnowledgeBase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Check, CircleX, X, Upload } from 'lucide-react'

interface ArticleEditorProps {
  article: Article | null
  onSave: (article: Article) => void
  onCancel: () => void
}

export default function ArticleEditor({ article, onSave, onCancel }: ArticleEditorProps) {
  const [formData, setFormData] = useState<Omit<Article, 'id' | 'createdAt' | 'updatedAt'>>({
    title: article?.title || '',
    description: article?.description || '',
    content: article?.content || '',
    image: article?.image || '',
  })

  const [uploadedImage, setUploadedImage] = useState<string>(article?.image || '')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    // ファイルをデータURLとして読み込む
    const reader = new FileReader()
    reader.onload = (event) => {
      const imageData = event.target?.result as string
      setUploadedImage(imageData)
      setFormData((prev) => ({
        ...prev,
        image: imageData,
      }))
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setUploadedImage('')
    setFormData((prev) => ({
      ...prev,
      image: '',
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      alert('タイトルと説明は必須です')
      return
    }

    const newArticle: Article = {
      id: article?.id || 'new',
      ...formData,
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date(),
    }

    onSave(newArticle)
  }

  return (
    <div className="h-full flex flex-col">
      {/* エディタヘッダー */}
      <div className="border-b border-border bg-card p-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-foreground">
          {article ? '記事を編集' : '新しい記事を作成'}
        </h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            aria-label="キャンセル"
            className="bg-[linear-gradient(135deg,_#c19a6b,_#a67c52,_#8b6542)] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
          >
            <CircleX size={18} />
          </Button>
          <Button
            onClick={handleSubmit}
            aria-label="保存"
            className="bg-[linear-gradient(135deg,_#5c3d2e,_#4a2f20,_#3d2517)] text-white shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)]"
          >
            <Check size={18} />
          </Button>
        </div>
      </div>

      {/* フォーム */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl space-y-6">
          {/* タイトル */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">タイトル *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="記事のタイトルを入力"
              className="bg-background border-input"
              required
            />
          </div>

          {/* 説明 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">説明 *</label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="簡潔な説明を入力"
              className="bg-background border-input"
              required
            />
          </div>

          {/* 画像アップロード */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">画像</label>

            {uploadedImage ? (
              <div className="relative inline-block">
                <img
                  src={uploadedImage}
                  alt="Preview"
                  className="max-w-md h-auto rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:opacity-80"
                  title="画像を削除"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-accent hover:bg-muted transition-colors"
              >
                <Upload className="mx-auto mb-3 text-muted-foreground" size={32} />
                <p className="text-sm font-medium text-foreground mb-1">画像をアップロード</p>
                <p className="text-xs text-muted-foreground">
                  クリックするか、ここにドラッグ&ドロップしてください
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
            />
          </div>

          {/* コンテンツ */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">コンテンツ</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="記事の内容を入力"
              className="min-h-64 bg-background border-input resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
