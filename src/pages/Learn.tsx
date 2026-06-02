import { useState } from 'react'
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, XCircle, Clock, BarChart2 } from 'lucide-react'
import { LESSONS, CATEGORIES, CATEGORY_COLORS, type Lesson, type Category } from '../lib/lessons'

/* ── helpers ── */
function diffColor(d: Lesson['difficulty']) {
  if (d === 'Beginner') return '#059669'
  if (d === 'Intermediate') return '#d97706'
  return '#dc2626'
}

/* ── Quiz component ── */
function Quiz({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [showResult, setShowResult] = useState(false)

  const q = lesson.quiz[current]
  const total = lesson.quiz.length
  const confirmed = selected !== null && answers.length > current

  function confirm() {
    if (selected === null) return
    const correct = selected === q.correct
    setAnswers([...answers, correct])
  }

  function next() {
    if (current + 1 < total) {
      setCurrent(current + 1)
      setSelected(null)
    } else {
      setShowResult(true)
    }
  }

  if (showResult) {
    const score = answers.filter(Boolean).length
    const pct = Math.round((score / total) * 100)
    return (
      <div className="quiz-result">
        <div className="quiz-score-ring" style={{ '--pct': pct } as React.CSSProperties}>
          <span className="quiz-score-num">{pct}%</span>
        </div>
        <h2 className="quiz-result-title">
          {pct === 100 ? '🎉 Perfect score!' : pct >= 66 ? '👍 Good work!' : '📚 Keep studying!'}
        </h2>
        <p className="quiz-result-sub">{score} of {total} correct</p>
        <div className="quiz-result-actions">
          <button className="btn-pill btn-primary" onClick={onBack}>Back to lessons</button>
          <button className="btn-pill btn-outline" onClick={() => {
            setCurrent(0); setSelected(null); setAnswers([]); setShowResult(false)
          }}>Retry quiz</button>
        </div>
      </div>
    )
  }

  return (
    <div className="quiz-wrap">
      <div className="quiz-progress">
        <span className="quiz-progress-label">Question {current + 1} of {total}</span>
        <div className="quiz-progress-bar">
          <div className="quiz-progress-fill" style={{ width: `${((current) / total) * 100}%` }} />
        </div>
      </div>

      <h3 className="quiz-question">{q.question}</h3>

      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = 'quiz-option'
          if (confirmed) {
            if (i === q.correct) cls += ' quiz-option-correct'
            else if (i === selected && selected !== q.correct) cls += ' quiz-option-wrong'
          } else if (i === selected) {
            cls += ' quiz-option-selected'
          }
          return (
            <button
              key={i}
              className={cls}
              onClick={() => !confirmed && setSelected(i)}
              disabled={confirmed}
            >
              <span className="quiz-option-letter">{String.fromCharCode(65 + i)}</span>
              {opt}
              {confirmed && i === q.correct && <CheckCircle size={16} className="quiz-icon-correct" />}
              {confirmed && i === selected && selected !== q.correct && <XCircle size={16} className="quiz-icon-wrong" />}
            </button>
          )
        })}
      </div>

      {confirmed && (
        <div className={`quiz-explanation ${answers[current] ? 'explanation-correct' : 'explanation-wrong'}`}>
          <strong>{answers[current] ? 'Correct!' : 'Not quite.'}</strong> {q.explanation}
        </div>
      )}

      <div className="quiz-actions">
        {!confirmed ? (
          <button
            className="btn-pill btn-primary"
            onClick={confirm}
            disabled={selected === null}
          >
            Confirm Answer
          </button>
        ) : (
          <button className="btn-pill btn-primary" onClick={next}>
            {current + 1 < total ? 'Next Question' : 'See Results'}
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Lesson detail ── */
function LessonDetail({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  const [mode, setMode] = useState<'read' | 'quiz'>('read')

  return (
    <div className="lesson-detail">
      <button className="lesson-back" onClick={onBack}>
        <ChevronLeft size={16} /> Back to lessons
      </button>

      {mode === 'read' ? (
        <>
          <div className="lesson-detail-header">
            <span className="lesson-emoji">{lesson.emoji}</span>
            <div>
              <div className="lesson-meta-row">
                <span
                  className="lesson-category-badge"
                  style={{ background: CATEGORY_COLORS[lesson.category] + '22', color: CATEGORY_COLORS[lesson.category], borderColor: CATEGORY_COLORS[lesson.category] + '44' }}
                >
                  {lesson.category}
                </span>
                <span className="lesson-diff-badge" style={{ color: diffColor(lesson.difficulty) }}>
                  {lesson.difficulty}
                </span>
                <span className="lesson-time"><Clock size={12} /> {lesson.readMins} min read</span>
              </div>
              <h1 className="lesson-detail-title">{lesson.title}</h1>
              <p className="lesson-detail-summary">{lesson.summary}</p>
            </div>
          </div>

          <div className="lesson-body">
            {lesson.body.split('\n\n').map((para, i) => {
              // Bold markdown-style **text**
              const rendered = para.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                part.startsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part
              )
              return <p key={i}>{rendered}</p>
            })}
          </div>

          <div className="lesson-quiz-cta">
            <h3>Test your knowledge</h3>
            <p>Answer {lesson.quiz.length} quick questions to reinforce what you just learned.</p>
            <button className="btn-pill btn-primary" onClick={() => setMode('quiz')}>
              Start Quiz <ChevronRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <Quiz lesson={lesson} onBack={() => setMode('read')} />
      )}
    </div>
  )
}

/* ── Main Learn page ── */
export default function Learn() {
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All')
  const [openLesson, setOpenLesson] = useState<Lesson | null>(null)

  const filtered = activeCategory === 'All'
    ? LESSONS
    : LESSONS.filter((l) => l.category === activeCategory)

  if (openLesson) {
    return (
      <div className="learn-page">
        <LessonDetail lesson={openLesson} onBack={() => setOpenLesson(null)} />
      </div>
    )
  }

  return (
    <div className="learn-page">
      <div className="learn-header">
        <div>
          <h1 className="page-title">Learn to Trade</h1>
          <p className="page-sub">
            {LESSONS.length} lessons across stocks, strategy, risk, and psychology. Read then test yourself.
          </p>
        </div>
        <div className="learn-stats">
          <div className="learn-stat">
            <BookOpen size={18} />
            <span>{LESSONS.length} lessons</span>
          </div>
          <div className="learn-stat">
            <BarChart2 size={18} />
            <span>{LESSONS.reduce((a, l) => a + l.quiz.length, 0)} quiz questions</span>
          </div>
        </div>
      </div>

      <div className="filter-tabs" style={{ marginBottom: '1.75rem' }}>
        {(['All', ...CATEGORIES] as const).map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
            style={activeCategory === cat && cat !== 'All'
              ? { background: CATEGORY_COLORS[cat as Category] + '22', borderColor: CATEGORY_COLORS[cat as Category], color: CATEGORY_COLORS[cat as Category] }
              : {}
            }
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="lessons-grid">
        {filtered.map((lesson) => (
          <button
            key={lesson.id}
            className="lesson-card"
            onClick={() => setOpenLesson(lesson)}
          >
            <div className="lesson-card-top">
              <span className="lesson-emoji">{lesson.emoji}</span>
              <div className="lesson-card-badges">
                <span
                  className="lesson-category-badge"
                  style={{ background: CATEGORY_COLORS[lesson.category] + '22', color: CATEGORY_COLORS[lesson.category], borderColor: CATEGORY_COLORS[lesson.category] + '44' }}
                >
                  {lesson.category}
                </span>
              </div>
            </div>
            <h3 className="lesson-card-title">{lesson.title}</h3>
            <p className="lesson-card-summary">{lesson.summary}</p>
            <div className="lesson-card-footer">
              <span className="lesson-time"><Clock size={11} /> {lesson.readMins} min</span>
              <span className="lesson-diff" style={{ color: diffColor(lesson.difficulty) }}>
                {lesson.difficulty}
              </span>
              <span className="lesson-quiz-count">{lesson.quiz.length} questions</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
