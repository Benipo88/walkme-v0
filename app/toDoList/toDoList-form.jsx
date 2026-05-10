'use client'

import { useState, useEffect } from "react"

// ==================== 確認シートデータ ====================
const questions = [
  {
    id: 1, text: "故人が住民票上の世帯主でしたか？",
    options: ["はい", "いいえ", "わからない"],
    children: [{ id: "1a", parentId: 1, condition: "はい", text: "故人を含めて世帯員が3人以上いますか？", options: ["はい", "いいえ", "わからない"] }],
  },
  { id: 2, text: "故人は年金加入中または受給者でしたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 3, text: "加入中または受給中の場合、年金の種別を教えてください。", options: ["国民年金", "厚生年金", "その他"] },
  { id: 4, text: "故人は国民健康保険被保険者証を持っていましたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 5, text: "故人は後期高齢者医療被保険者証を持っていましたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 6, text: "（故人が世帯主の場合）同一世帯に国民健康保険に加入中の方はいますか？", options: ["はい", "いいえ", "わからない"] },
  { id: 7, text: "故人は介護保険被保険者証を持っていましたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 8, text: "故人の要介護・要支援の申請中でしたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 9, text: "故人は緊急通報装置、福祉電話の貸与を受けていましたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 10, text: "介護保険証や健康保険証（国保・後期高齢）は、住所地特例により宜野湾市以外の市町村から発行されたものですか？", options: ["はい", "いいえ", "わからない"] },
  { id: 11, text: "故人に市・県民税が課税されていましたか？", options: ["はい", "いいえ", "わからない"] },
  { id: 12, text: "故人が原動機付自転車（原付）等を所有していましたか？", options: ["はい", "いいえ", "わからない"] },
  {
    id: 13, text: "故人は、本市に固定資産（土地・家屋）を所有していましたか？",
    options: ["はい", "いいえ", "わからない"],
    children: [
      { id: "13a", parentId: 13, condition: "はい", text: "共有名義の固定資産の共有代表者として課税されていましたか？", options: ["はい", "いいえ", "わからない"] },
      { id: "13b", parentId: 13, condition: "はい", text: "登記されていない家屋（未登記家屋）をお持ちでしたか？", options: ["はい", "いいえ", "わからない"] },
    ],
  },
  { id: 16, text: "故人が納税管理人や相続人代表者等として管理している税はありましたか？", options: ["はい", "いいえ", "わからない"] },
  {
    id: 17, text: "故人は障がいに関する制度を利用していましたか？",
    options: ["はい", "いいえ", "わからない"],
    children: [
      { id: "17a", parentId: 17, condition: "はい", text: "沖縄県心身障害者扶養共済制度に加入していますか？", options: ["はい", "いいえ", "わからない"] },
      { id: "17b", parentId: 17, condition: "はい", text: "身体障害者手帳、療育手帳、精神保健福祉手帳のいずれかをお持ちでしたか？", options: ["身体障害者手帳", "精神保健福祉手帳", "療育手帳"] },
      { id: "17c", parentId: 17, condition: "はい", text: "自立支援医療受給者証（精神通院）をお持ちでしたか？", options: ["はい", "いいえ", "わからない"] },
      { id: "17d", parentId: 17, condition: "はい", text: "更生医療受給者証、育成医療受給者証をお持ちでしたか？", options: ["はい", "いいえ", "わからない"] },
      { id: "17e", parentId: 17, condition: "はい", text: "特別障害者手当、障害児福祉手当を受給していましたか？", options: ["はい", "いいえ", "わからない"] },
      { id: "17f", parentId: 17, condition: "はい", text: "受給者証（障害福祉サービス、地域相談支援、障害児通所支援）をお持ちでしたか？", options: ["はい", "いいえ", "わからない"] },
      { id: "17g", parentId: 17, condition: "はい", text: "重度心身障害者医療費助成を受給していましたか？", options: ["はい", "いいえ", "わからない"] },
    ],
  },
  {
    id: 25, text: "故人が養育している児童はいましたか？（※18歳以下または20歳未満で障害をお持ちの方）",
    options: ["はい", "いいえ", "わからない"],
    children: [
      { id: "25a", parentId: 25, condition: "はい", text: "小中学校に通っている児童はいますか？", options: ["はい", "いいえ", "わからない"] },
      { id: "25b", parentId: 25, condition: "はい", text: "保育園または幼稚園に通っている児童はいますか？", options: ["はい", "いいえ", "わからない"] },
    ],
  },
  { id: 28, text: "故人は、児童手当・児童扶養手当・特別児童扶養手当の支給対象児童でしたか？", options: ["はい", "いいえ", "わからない"] },
];

// ==================== チェックリストデータ ====================
const checklistSections = [
  {
    section: "（1）市役所で行う手続き",
    categories: [
      {
        title: "1. 戸籍・住民登録等",
        items: [
          { id: "c1", text: "死亡の記載がされた戸籍謄本等を希望する方" },
          { id: "c2", text: "死亡届の写しの交付を希望する方" },
          { id: "c3", text: "印鑑登録証をお持ちの方" },
          { id: "c4", text: "マイナンバーカード・通知カードをお持ちの方" },
          { id: "c5", text: "日本国発行の旅券をお持ちの方" },
        ],
      },
      {
        title: "2. 年金",
        items: [
          { id: "c6", text: "国民年金の加入者" },
          { id: "c7", text: "国民年金の受給者" },
        ],
      },
      {
        title: "3. 国民健康保険・後期高齢者医療保険",
        items: [
          { id: "c8", text: "国民健康保険の被保険者（74歳以下）" },
          { id: "c9", text: "後期高齢者医療保険の被保険者" },
        ],
      },
      {
        title: "4. 障がい福祉",
        items: [
          { id: "c10", text: "身体障害者手帳をお持ちの方" },
          { id: "c11", text: "療育手帳をお持ちの方" },
          { id: "c12", text: "精神保健福祉手帳をお持ちの方" },
          { id: "c13", text: "自立支援医療受給者証（精神通院）をお持ちの方" },
          { id: "c14", text: "更生医療受給者証、育成医療受給者証をお持ちの方" },
          { id: "c15", text: "特別障害者手当の受給者" },
          { id: "c16", text: "障害児福祉手当の対象児童" },
          { id: "c17", text: "沖縄県心身障害者扶養共済の対象心身障害者" },
          { id: "c18", text: "沖縄県心身障害者扶養共済の加入者" },
          { id: "c19", text: "受給者証（障害福祉サービス、地域生活支援、障害児通所支援）をお持ちの方" },
          { id: "c20", text: "重度心身障害者（児）医療費助成の受給者" },
        ],
      },
      {
        title: "6. 高齢者サービス",
        items: [
          { id: "c21", text: "電話機に緊急通報装置を設置していた方" },
          { id: "c22", text: "福祉電話を設置していた方" },
        ],
      },
      {
        title: "7. 介護保険",
        items: [
          { id: "c23", text: "第1号被保険者（65歳以上）または第2号被保険者（40歳以上65歳未満）で介護サービスを利用していた方" },
          { id: "c24", text: "基準額以上の介護サービス費を支払いしていた方" },
          { id: "c25", text: "要介護認定申請中の方" },
        ],
      },
      {
        title: "8. 市税等",
        items: [
          { id: "c26", text: "市税に未納のある方" },
          { id: "c27", text: "市税などの口座振替納付を利用していた方" },
          { id: "c28", text: "市・県民税を納税していた方" },
          { id: "c29", text: "固定資産（土地・建物）の所有者または固定資産税を納税していた相続人代表" },
          { id: "c30", text: "原動機付自転車・ミニカー・農耕車等の所有者" },
          { id: "c31", text: "未登記家屋の所有者" },
        ],
      },
      {
        title: "9. 墓地",
        items: [{ id: "c32", text: "個人墓地（家之墓）を所有（経営）している方" }],
      },
      {
        title: "11. 農地",
        items: [{ id: "c33", text: "農地を相続した方" }],
      },
      {
        title: "13. 火葬料等負担軽減補助金",
        items: [{ id: "c34", text: "火葬料を支払った方" }],
      },
    ],
  },
  {
    section: "（2）市役所以外で行う手続き",
    categories: [
      {
        title: "1. 各種手続き",
        items: [
          { id: "c35", text: "125cc超のバイク、三輪・四輪の軽自動車、普通自動車等の廃車・名義変更をする方" },
          { id: "c36", text: "上下水道の名義人" },
          { id: "c37", text: "普通自動車税を納税していた方" },
          { id: "c38", text: "土地・登記済家屋の名義変更をする方" },
          { id: "c39", text: "浄化槽の使用者" },
          { id: "c40", text: "農業者年金の加入者、受給者" },
          { id: "c41", text: "運転免許証をお持ちの方" },
          { id: "c42", text: "電気料金の名義人" },
          { id: "c43", text: "ガス料金の名義人" },
          { id: "c44", text: "NHKの名義人" },
          { id: "c45", text: "携帯電話の名義人" },
          { id: "c46", text: "クレジットカードの解約をする方" },
          { id: "c47", text: "預貯金口座の名義人" },
          { id: "c48", text: "生命保険等の名義人" },
          { id: "c49", text: "株式等の名義人" },
          { id: "c50", text: "国債（戦没者等特別弔慰金）の名義人" },
          { id: "c51", text: "その他利用サービスの名義人" },
        ],
      },
    ],
  },
  {
    section: "（3）相続に関する手続き",
    categories: [
      {
        title: "相続に関する手続き",
        items: [
          { id: "c52", text: "相続に関する各種手続き（相続に関する調査・遺言書に関する手続き等）をする方" },
        ],
      },
    ],
  },
];

// ==================== ヘルパー ====================
function getAllQuestions(answers) {
  const all = [];
  questions.forEach((q) => {
    all.push(q);
    if (q.children) {
      q.children.forEach((child) => {
        if (answers[q.id] === child.condition) all.push(child);
      });
    }
  });
  return all;
}

const tagColor = {
  はい: { bg: "#e8f5e9", color: "#2e7d32", border: "#81c784" },
  いいえ: { bg: "#f5f5f5", color: "#616161", border: "#bdbdbd" },
  わからない: { bg: "#fce4ec", color: "#c62828", border: "#ef9a9a" },
  国民年金: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  厚生年金: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  その他: { bg: "#f5f5f5", color: "#616161", border: "#bdbdbd" },
  身体障害者手帳: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
  精神保健福祉手帳: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
  療育手帳: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
};

function Tag({ val }) {
  const c = tagColor[val] || { bg: "#f5f5f5", color: "#555", border: "#ccc" };
  return (
    <span style={{
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: 20, padding: "2px 14px", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap"
    }}>{val}</span>
  );
}

// ==================== メインコンポーネント ====================
export default function OkuyamiApp() {
  // page: "sheet" | "checklist" | "confirm"
  const [page, setPage] = useState("sheet");
  const [answers, setAnswers] = useState({});
  const [checkAnswers, setCheckAnswers] = useState({});
  const [checkOther, setCheckOther] = useState({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/save-toDoList', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data?.answers) setAnswers(data.answers)
        if (data?.check_answers) setCheckAnswers(data.check_answers)
        if (data?.check_other) setCheckOther(data.check_other)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visibleQuestions = getAllQuestions(answers);
  const answered = visibleQuestions.filter((q) => answers[q.id] !== undefined).length;
  const progress = visibleQuestions.length > 0 ? Math.round((answered / visibleQuestions.length) * 100) : 0;

  const totalCheck = checklistSections.reduce((a, s) => a + s.categories.reduce((b, c) => b + c.items.length, 0), 0);
  const answeredCheck = Object.keys(checkAnswers).length;
  const checkProgress = Math.round((answeredCheck / totalCheck) * 100);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      const q = questions.find((q) => q.id === id);
      if (q?.children) {
        q.children.forEach((child) => { if (next[id] !== child.condition) delete next[child.id]; });
      }
      return next;
    });
  };

  const handleCheck = (id, value) => {
    setCheckAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handlePrint = () => window.print()

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    setSaveError("")
    try {
      const res = await fetch('/api/save-toDoList', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, checkAnswers, checkOther }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.error || ''
        if (msg.includes('row-level security')) throw new Error('保存に失敗しました（アクセス権限エラー）')
        throw new Error('保存に失敗しました。しばらく経ってから再度お試しください。')
      }
      setSaved(true)
    } catch (e) {
      setSaveError(e.message)
    } finally {
      setSaving(false)
    }
  };

  // 木目調カラー定義
  const WOOD = {
    light: "linear-gradient(135deg, #c19a6b 0%, #a67c52 50%, #8b6542 100%)",
    dark:  "linear-gradient(135deg, #5c3d2e 0%, #4a2f20 50%, #3d2517 100%)",
    bg:    "linear-gradient(160deg, #f5ede0 0%, #ede0cc 100%)",
    card:  "linear-gradient(135deg, #fdf6ee 0%, #f5e9d6 100%)",
    header:"linear-gradient(135deg, #5c3d2e 0%, #4a2f20 60%, #3d2517 100%)",
    tab:   "linear-gradient(180deg, #f5ede0 0%, #ede0cc 100%)",
    section:"linear-gradient(135deg, #7a5230 0%, #5c3d2e 100%)",
    category:"linear-gradient(135deg, #e8d5b7 0%, #ddc89f 100%)",
    progress: "linear-gradient(90deg, #a67c52, #c19a6b)",
    indentBorder: "#a67c52",
    mainBorder: "#7a5230",
    text: "#3d2517",
    subText: "#7a5230",
    border: "#d4a96a",
  };

  const S = {
    wrap: { minHeight: "100vh", background: WOOD.bg, fontFamily: "'Hiragino Kaku Gothic Pro','Meiryo',sans-serif" },
    header: { background: WOOD.header, color: "#fff", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(61,37,23,0.25)" },
    tabBar: { display: "flex", borderBottom: `2px solid #c4a06a`, background: WOOD.tab },
    tabBtn: (active) => ({
      padding: "12px 28px", cursor: "pointer", fontWeight: 700, fontSize: 14,
      border: "none", background: "transparent",
      borderBottom: active ? `3px solid #7a5230` : "3px solid transparent",
      color: active ? "#5c3d2e" : "#a67c52", transition: "all 0.15s",
    }),
    subTabBtn: () => ({
      padding: "6px 18px", cursor: "pointer", fontWeight: 700, fontSize: 13,
      border: "1px solid rgba(255,255,255,0.4)", borderRadius: 6,
      background: "rgba(255,255,255,0.15)", color: "#fff",
    }),
    card: (indent) => ({
      background: WOOD.card,
      borderRadius: 10, marginBottom: 12,
      padding: "16px 20px",
      boxShadow: "0 2px 8px rgba(122,82,48,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      borderLeft: indent ? `4px solid ${WOOD.indentBorder}` : `4px solid ${WOOD.mainBorder}`,
      marginLeft: indent ? 24 : 0,
      border: `1px solid ${WOOD.border}`,
    }),
    radioBtn: (selected) => ({
      display: "flex", alignItems: "center", gap: 6,
      cursor: "pointer", padding: "7px 16px", borderRadius: 24,
      border: selected ? `2px solid #7a5230` : `1.5px solid #c4a06a`,
      background: selected ? WOOD.light : "rgba(255,255,255,0.6)",
      color: selected ? "#fff" : "#5c3d2e",
      fontWeight: selected ? 700 : 400, fontSize: 14, transition: "all 0.15s",
      userSelect: "none",
      boxShadow: selected ? "0 2px 6px rgba(122,82,48,0.3)" : "inset 0 1px 3px rgba(0,0,0,0.05)",
    }),
    sectionHeader: { background: WOOD.section, color: "#fff", padding: "10px 18px", fontWeight: 700, fontSize: 15, borderRadius: "8px 8px 0 0", textShadow: "0 1px 2px rgba(0,0,0,0.3)" },
    categoryHeader: { background: WOOD.category, color: "#5c3d2e", padding: "8px 18px", fontWeight: 700, fontSize: 13, borderBottom: `1px solid ${WOOD.border}` },
    checkItem: { padding: "14px 18px", borderBottom: `1px solid #e8d5b7`, display: "flex", flexDirection: "column", gap: 10 },
    primaryBtn: { background: WOOD.dark, color: "#fff", border: "none", borderRadius: 30, padding: "13px 44px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 10px rgba(61,37,23,0.35)", textShadow: "0 1px 2px rgba(0,0,0,0.3)" },
    outlineBtn: { background: WOOD.light, color: "#fff", border: "none", borderRadius: 30, padding: "11px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 3px 10px rgba(122,82,48,0.25)" },
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(160deg, #f5ede0 0%, #ede0cc 100%)", fontFamily: "'Hiragino Kaku Gothic Pro','Meiryo',sans-serif", color: "#7a5230", fontSize: 16 }}>
      読み込み中...
    </div>
  )

  return (
    <div style={S.wrap}>
      {/* ヘッダー */}
      <div style={S.header}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 2 }}>おくやみ手続き</div>

        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {page === "confirm" && (
            <button style={S.subTabBtn()} onClick={handlePrint}>🖨️ 印刷</button>
          )}
        </div>
      </div>

      {/* タブ（確認画面では非表示） */}
      {page !== "confirm" && (
        <div style={S.tabBar}>
          <button style={S.tabBtn(page === "sheet")} onClick={() => setPage("sheet")}>
            確認シート
          </button>
          <button style={S.tabBtn(page === "checklist")} onClick={() => setPage("checklist")}>
            チェックリスト
          </button>
        </div>
      )}

      {/* ==================== 確認シート入力 ==================== */}
      {page === "sheet" && (
        <>
          <div style={{ background: "#e8d5b7", height: 5 }}>
            <div style={{ height: 5, width: `${progress}%`, background: "linear-gradient(90deg, #a67c52, #c19a6b)", transition: "width 0.3s" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#888", padding: "4px 20px" }}>
            回答済み {answered} / {visibleQuestions.length} 問（{progress}%）
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 16px 80px" }}>
            {visibleQuestions.map((q, idx) => {
              const isChild = typeof q.id === "string";
              return (
                <div key={q.id} style={S.card(isChild)}>
                  <div style={{ fontSize: 11, color: "#999", marginBottom: 5 }}>{isChild ? "↳ 追加質問" : `問 ${idx + 1}`}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#222", marginBottom: 12, lineHeight: 1.6 }}>{q.text}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {q.options.map((opt) => (
                      <label key={opt} style={S.radioBtn(answers[q.id] === opt)}>
                        <input type="radio" name={`q-${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handleAnswer(q.id, opt)} style={{ display: "none" }} />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button style={S.primaryBtn} onClick={() => setPage("checklist")}>
                次へ：チェックリスト →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ==================== チェックリスト入力 ==================== */}
      {page === "checklist" && (
        <>
          <div style={{ background: "#e8d5b7", height: 5 }}>
            <div style={{ height: 5, width: `${checkProgress}%`, background: "linear-gradient(90deg, #a67c52, #c19a6b)", transition: "width 0.3s" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 12, color: "#888", padding: "4px 20px" }}>
            選択済み {answeredCheck} / {totalCheck} 項目（{checkProgress}%）
          </div>
          <div style={{ maxWidth: 720, margin: "0 auto", padding: "12px 16px 80px" }}>
            {checklistSections.map((sec) => (
              <div key={sec.section} style={{ marginBottom: 16 }}>
                <div style={{ ...S.sectionHeader, borderRadius: "8px 8px 0 0", marginBottom: 0 }}>{sec.section}</div>
                {sec.categories.map((cat, catIdx) => (
                  <div key={cat.title} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 13, color: "#7a5230", background: "#e8d5b7", border: "1px solid #c4a06a", borderRadius: "6px 6px 0 0", padding: "5px 14px", fontWeight: 700 }}>{cat.title}</div>
                    <div style={{ background: WOOD.card, border: "1px solid #d4a96a", borderTop: "none", borderRadius: "0 0 6px 6px" }}>
                      {cat.items.map((item, idx) => {
                        const sel = checkAnswers[item.id];
                        return (
                          <div key={item.id} style={{ padding: "10px 14px", borderBottom: idx < cat.items.length - 1 ? "1px solid #e8d5b7" : "none" }}>
                            <div style={{ fontSize: 14, color: "#222", marginBottom: 8, lineHeight: 1.5 }}>{item.text}</div>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                              {["はい", "いいえ", "わからない"].map((opt) => (
                                <label key={opt} style={S.radioBtn(sel === opt)}>
                                  <input type="radio" name={`c-${item.id}`} value={opt} checked={sel === opt} onChange={() => handleCheck(item.id, opt)} style={{ display: "none" }} />
                                  {opt}
                                </label>
                              ))}
                              {sel === "わからない" && (
                                <input
                                  type="text"
                                  placeholder="何がわからないかを記載"
                                  value={checkOther[item.id] || ""}
                                  onChange={(e) => setCheckOther((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                  style={{ border: "1.5px solid #ccc", borderRadius: 6, padding: "6px 12px", fontSize: 13, outline: "none", minWidth: 180 }}
                                />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
              <button style={S.outlineBtn} onClick={() => setPage("sheet")}>← 確認シートに戻る</button>
              <button style={S.primaryBtn} onClick={() => setPage("confirm")}>確認画面へ →</button>
            </div>
          </div>
        </>
      )}

      {/* ==================== 確認画面（両方まとめて表示） ==================== */}
      {page === "confirm" && (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px 16px 80px" }}>

          {/* 確認シート一覧 */}
          <div style={{ background: "linear-gradient(135deg, #fdf6ee, #f5e9d6)", borderRadius: 10, boxShadow: "0 2px 8px rgba(122,82,48,0.12)", overflow: "hidden", marginBottom: 24, border: "1px solid #d4a96a" }}>
            <div style={{ background: "linear-gradient(135deg, #5c3d2e, #3d2517)", color: "#fff", padding: "12px 20px", fontWeight: 700, fontSize: 15 }}>
              📋 確認シート 回答一覧
            </div>
            {visibleQuestions.map((q, idx) => {
              const isChild = typeof q.id === "string";
              const ans = answers[q.id];
              return (
                <div key={q.id} style={{ display: "flex", gap: 12, padding: "12px 20px", paddingLeft: isChild ? 40 : 20, borderBottom: "1px solid #f0f0f0", background: ans === "いいえ" ? "#eeeeee" : isChild ? "#f9fbff" : "#fff" }}>
                  <div style={{ minWidth: 30, color: "#999", fontSize: 12, paddingTop: 2 }}>{isChild ? "↳" : `Q${idx + 1}`}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#555", marginBottom: 5, lineHeight: 1.5 }}>{q.text}</div>
                    {ans ? <Tag val={ans} /> : <span style={{ color: "#ccc", fontSize: 12 }}>未回答</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* チェックリスト一覧 */}
          <div style={{ background: "linear-gradient(135deg, #fdf6ee, #f5e9d6)", borderRadius: 10, boxShadow: "0 2px 8px rgba(122,82,48,0.12)", overflow: "hidden", marginBottom: 24, border: "1px solid #d4a96a" }}>
            <div style={{ background: "linear-gradient(135deg, #5c3d2e, #3d2517)", color: "#fff", padding: "12px 20px", fontWeight: 700, fontSize: 15 }}>
              ✅ チェックリスト 選択一覧
            </div>
            {checklistSections.map((sec) => (
              <div key={sec.section} style={{ marginBottom: 12 }}>
                <div style={{ background: S.sectionHeader.background, color: "#fff", padding: "6px 20px", fontWeight: 700, fontSize: 13 }}>{sec.section}</div>
                {sec.categories.map((cat) => (
                  <div key={cat.title} style={{ marginTop: 8, marginLeft: 12, marginRight: 12 }}>
                    <div style={{ fontSize: 12, color: "#7a5230", background: "#e8d5b7", border: "1px solid #c4a06a", borderRadius: "4px 4px 0 0", padding: "3px 12px", fontWeight: 700 }}>{cat.title}</div>
                    <div style={{ border: "1px solid #c4a06a", borderTop: "none", borderRadius: "0 0 4px 4px" }}>
                      {cat.items.map((item, idx) => {
                        const sel = checkAnswers[item.id];
                        const other = checkOther[item.id];
                        return (
                          <div key={item.id} style={{ padding: "8px 12px", borderBottom: idx < cat.items.length - 1 ? "1px solid #f0f0f0" : "none", background: sel === "いいえ" ? "#eeeeee" : undefined }}>
                            <div style={{ fontSize: 13, color: "#555", marginBottom: 4, lineHeight: 1.5 }}>{item.text}</div>
                            {sel ? (
                              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <Tag val={sel} />
                                {sel === "わからない" && other && <span style={{ fontSize: 12, color: "#777" }}>{other}</span>}
                              </div>
                            ) : <span style={{ color: "#ccc", fontSize: 12 }}>未選択</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 20 }}>
            <button style={S.outlineBtn} onClick={() => setPage("checklist")}>← 入力に戻る</button>
            <button style={S.primaryBtn} onClick={handleSave} disabled={saving || saved}>
              {saving ? "保存中..." : saved ? "✓ 保存済み" : "保存"}
            </button>
          </div>
          {saveError && (
            <div style={{ color: "#c62828", textAlign: "center", marginTop: 12, fontSize: 13 }}>{saveError}</div>
          )}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <button style={S.outlineBtn} onClick={handlePrint}>🖨️ 印刷</button>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          button { display: none !important; }
        }
      `}</style>
    </div>
  );
}
