import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('todolist_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    return Response.json({ error: error.message }, { status: 500 })
  }
  return Response.json(data ?? null)
}

export async function POST(request) {
  const { answers, checkAnswers, checkOther } = await request.json()

  const supabase = getSupabase()

  const { error } = await supabase
    .from('todolist_submissions')
    .insert({ answers, check_answers: checkAnswers, check_other: checkOther })

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: process.env.NOTIFY_EMAIL,
    subject: 'やること：データが保存されました',
    text: 'やることの確認シート・チェックリストのデータが保存されました。',
  })

  return Response.json({ success: true })
}
