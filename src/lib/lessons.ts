export interface Quiz {
  question: string
  options: string[]
  correct: number // index of correct option
  explanation: string
}

export interface Lesson {
  id: string
  title: string
  category: Category
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  readMins: number
  emoji: string
  summary: string
  body: string // markdown-style paragraphs separated by \n\n
  quiz: Quiz[]
}

export type Category = 'Basics' | 'Strategy' | 'Risk' | 'Analysis' | 'Psychology'

export const LESSONS: Lesson[] = [
  {
    id: 'what-is-a-stock',
    title: 'What Is a Stock?',
    category: 'Basics',
    difficulty: 'Beginner',
    readMins: 3,
    emoji: '📈',
    summary: 'Understand what you actually own when you buy a share.',
    body: `When a company wants to raise money to grow — build new factories, hire staff, launch products — it can sell small pieces of ownership to the public. These pieces are called **stocks** (also called shares or equities).

When you buy one share of Apple, you literally own a tiny fraction of Apple Inc. If Apple grows and becomes more valuable, your share becomes worth more. If Apple shrinks, your share loses value.

**Why do companies go public?**
Going public (called an IPO — Initial Public Offering) lets a company raise large amounts of money quickly. In exchange, they give up partial ownership and must report their finances publicly every quarter.

**How do you make money from stocks?**
Two ways: (1) **Price appreciation** — you buy at $100, it goes to $150, you sell and pocket $50. (2) **Dividends** — some companies share their profits with shareholders as regular cash payments.

**What is the stock market?**
It's simply a marketplace where buyers and sellers agree on prices for shares. Major ones include the NYSE (New York Stock Exchange) and NASDAQ. Prices change every second during trading hours based on supply and demand.

**Paper trading (what TradeSim does) is the safest way to learn.** You practice with virtual money, make real decisions, see real consequences — without risking a single dollar.`,
    quiz: [
      {
        question: 'What does owning a share of a company mean?',
        options: [
          'You are lending money to the company',
          'You own a small piece of the company',
          'You work for the company',
          'You have guaranteed returns',
        ],
        correct: 1,
        explanation: 'A share represents partial ownership of a company. Shareholders are part-owners, not lenders.',
      },
      {
        question: 'What is an IPO?',
        options: [
          'A type of trading strategy',
          'When a private company first sells shares to the public',
          'A government bond',
          'An interest payment from a bank',
        ],
        correct: 1,
        explanation: 'IPO stands for Initial Public Offering — it\'s when a company first offers its shares on a public stock exchange.',
      },
      {
        question: 'Which of these is NOT a way to make money from stocks?',
        options: [
          'Price appreciation',
          'Dividends',
          'Guaranteed annual interest',
          'Selling shares at a profit',
        ],
        correct: 2,
        explanation: 'Stocks don\'t pay guaranteed interest — that\'s bonds. Stocks earn through price gains and dividends, both of which can go up or down.',
      },
    ],
  },
  {
    id: 'reading-stock-prices',
    title: 'How to Read a Stock Price',
    category: 'Basics',
    difficulty: 'Beginner',
    readMins: 4,
    emoji: '🔢',
    summary: 'Decode what all those numbers on a stock card actually mean.',
    body: `Every stock card on TradeSim shows a few key numbers. Here's exactly what each one means.

**Current Price**
The most recent price someone paid for one share. Markets are open Monday–Friday 9:30am–4:00pm Eastern Time. Outside those hours, you'll see the last closing price.

**Price Change & Percentage (%)**
This shows how much the price has moved since yesterday's market close. A green +2.5% means the stock is up 2.5% today. A red -1.2% means it dropped 1.2%. This resets every trading day.

**Volume**
How many shares have been traded today. High volume means lots of people are buying and selling — the stock is very active. Low volume means few people are trading it. Volume spikes often signal big news.

**What makes a price go up or down?**
Supply and demand. If more people want to buy than sell, price goes up. If more people want to sell than buy, price goes down.

Things that move prices: earnings reports, news, analyst upgrades/downgrades, broader market moves, economic data (jobs numbers, inflation), and sometimes just rumours.

**Market cap = company size**
Share price alone doesn't tell you how big a company is. A $5 stock with 10 billion shares outstanding is worth $50 billion. A $500 stock with 1 million shares is only worth $500 million. Market cap (price × total shares) is the real measure of a company's size.`,
    quiz: [
      {
        question: 'What does a +3.2% change on a stock card mean?',
        options: [
          'The stock has gone up 3.2% since it was first listed',
          'The stock has gone up 3.2% since yesterday\'s close',
          'The stock will go up 3.2% tomorrow',
          'You will make 3.2% profit if you buy now',
        ],
        correct: 1,
        explanation: 'The daily percentage change measures movement from the previous day\'s closing price to the current price.',
      },
      {
        question: 'What does high trading volume tell you?',
        options: [
          'The stock price will definitely go up',
          'The company is very profitable',
          'Many people are actively buying and selling the stock',
          'The stock is expensive',
        ],
        correct: 2,
        explanation: 'Volume measures trading activity. High volume means the stock is attracting lots of attention — often around news events.',
      },
      {
        question: 'Company A has a share price of $10 with 1 billion shares. Company B has a share price of $500 with 1 million shares. Which is bigger?',
        options: [
          'Company A — it has more shares',
          'Company B — its price is higher',
          'Company A — market cap of $10B vs $500M',
          'They are the same size',
        ],
        correct: 2,
        explanation: 'Market cap = price × shares. Company A: $10 × 1B = $10 billion. Company B: $500 × 1M = $500 million. Company A is 20x larger.',
      },
    ],
  },
  {
    id: 'diversification',
    title: 'Why You Should Never Put All Your Money in One Stock',
    category: 'Risk',
    difficulty: 'Beginner',
    readMins: 4,
    emoji: '🧺',
    summary: "Don't put all your eggs in one basket — the golden rule of investing.",
    body: `Imagine you put all $100,000 of your virtual cash into one company. That company's CEO gets arrested for fraud. The stock drops 80% overnight. You now have $20,000.

That's the risk of concentration. And it's why **diversification** is the most important concept in investing.

**What is diversification?**
Spreading your money across many different investments so that no single bad event can wipe you out. The classic phrase: "Don't put all your eggs in one basket."

**How to diversify:**
- Across **sectors** — own Tech, Healthcare, Finance, Energy, Consumer, not just Tech
- Across **company sizes** — mix large established companies with smaller growth companies
- Across **geographies** — US stocks, international stocks
- Across **asset types** — stocks, bonds, ETFs, cash

**ETFs make diversification easy**
An ETF (Exchange Traded Fund) like SPY holds all 500 companies in the S&P 500. When you buy one share of SPY, you're automatically invested in 500 companies. If one company collapses, it barely affects you.

**The tradeoff**
Diversification protects you from catastrophic loss, but it also limits huge gains. If you hold 50 stocks and one doubles, your portfolio only goes up 2%. Concentration can make you rich quickly — but it can also destroy you quickly. For most people, diversification wins long-term.

**On TradeSim:** practice building a diversified portfolio. Try allocating across at least 5 different sectors and see how it performs compared to betting everything on one stock.`,
    quiz: [
      {
        question: 'What is diversification?',
        options: [
          'Buying the most expensive stocks',
          'Investing only in tech companies',
          'Spreading investments across different assets to reduce risk',
          'Trading as frequently as possible',
        ],
        correct: 2,
        explanation: 'Diversification means spreading your money across different investments so a single bad event doesn\'t ruin your whole portfolio.',
      },
      {
        question: 'What is an ETF?',
        options: [
          'A type of savings account',
          'A fund that holds a collection of stocks, traded like a single share',
          'A government-issued bond',
          'A cryptocurrency',
        ],
        correct: 1,
        explanation: 'An ETF (Exchange Traded Fund) bundles many stocks together. SPY, for example, holds all 500 S&P 500 companies in one tradeable share.',
      },
      {
        question: 'What is the main tradeoff of diversification?',
        options: [
          'It increases your fees significantly',
          'It limits both catastrophic losses AND massive gains',
          'It only works in bull markets',
          'You need a lot of money to diversify',
        ],
        correct: 1,
        explanation: 'Diversification caps your upside as well as your downside. You\'re trading the chance of huge gains for protection against huge losses.',
      },
    ],
  },
  {
    id: 'buy-and-hold',
    title: 'Buy and Hold: The Boring Strategy That Actually Works',
    category: 'Strategy',
    difficulty: 'Beginner',
    readMins: 5,
    emoji: '⏳',
    summary: 'Why patience beats trying to outsmart the market.',
    body: `The most profitable investing strategy sounds boring: buy good companies, hold them for years, ignore daily price moves.

Warren Buffett, the most successful investor in history, has held some stocks for 30+ years. His best investments were ones he never sold.

**What is Buy and Hold?**
You buy shares in companies you believe will be worth more in 5–10 years than today. You then hold through the dips, the crashes, the scary headlines — and let compounding do its work.

**Why does it work?**
Historically, the US stock market has returned about **10% per year on average** — even accounting for crashes like 2008 and 2020. $10,000 invested in the S&P 500 in 2000, despite two massive crashes, would be worth over $70,000 today.

**The problem with trying to time the market**
Studies consistently show that most professional fund managers fail to beat the market index over 10+ years. Individual investors do even worse. The reason: we make emotional decisions. We panic-sell at the bottom, and FOMO-buy at the top.

A famous study found that if you missed just the 10 best trading days out of 7,500 trading days over 30 years, your returns were cut in half.

**Compound interest: the 8th wonder of the world**
$1,000 growing at 10% per year: after 10 years = $2,594. After 20 years = $6,727. After 30 years = $17,449. The longer you hold, the more your gains earn gains.

**How to use this on TradeSim**
Build a long-term portfolio. Pick 10–15 solid companies across sectors. Check it weekly, not daily. Resist the urge to sell when prices dip. Track your returns over time versus someone who trades constantly.`,
    quiz: [
      {
        question: 'What is the average historical annual return of the US stock market?',
        options: ['2-3%', '5-6%', 'About 10%', '20-25%'],
        correct: 2,
        explanation: 'The S&P 500 has returned approximately 10% per year on average historically, though individual years vary dramatically.',
      },
      {
        question: 'Why do most investors underperform the market index?',
        options: [
          'They don\'t have access to good stocks',
          'They make emotional decisions — panic selling and FOMO buying',
          'Individual investors pay higher taxes',
          'The market is rigged against small investors',
        ],
        correct: 1,
        explanation: 'Emotions are the enemy of good investing. Most investors buy high (when excited) and sell low (when scared), producing worse returns than simply holding an index fund.',
      },
      {
        question: '$1,000 invested at 10% per year — how much is it worth after 30 years?',
        options: ['$4,000', '$10,000', '~$17,500', '$30,000'],
        correct: 2,
        explanation: 'Compound growth means your gains also earn gains. $1,000 at 10% for 30 years = ~$17,449. This is why starting early matters so much.',
      },
    ],
  },
  {
    id: 'understanding-pe-ratio',
    title: 'What Is a P/E Ratio and Why Does It Matter?',
    category: 'Analysis',
    difficulty: 'Intermediate',
    readMins: 5,
    emoji: '🧮',
    summary: 'The single most used metric for judging if a stock is cheap or expensive.',
    body: `The **Price-to-Earnings ratio (P/E)** is the most widely used way to judge whether a stock is cheap or expensive relative to what the company actually earns.

**The formula:**
P/E Ratio = Stock Price ÷ Earnings Per Share (EPS)

**Example:**
Apple's stock price is $200. Apple earns $6.50 per share per year.
P/E = $200 ÷ $6.50 = 30.8

This means investors are paying $30.80 for every $1 of Apple's annual earnings.

**What does the number mean?**
- **Low P/E (under 15)** — potentially cheap, or market expects slow growth, or the company has problems
- **Average P/E (15–25)** — reasonable for established companies
- **High P/E (above 40)** — investors expect very fast future growth, OR the stock is overpriced

**Context matters hugely**
A tech startup might have a P/E of 100 because investors expect explosive growth. A utility company might have a P/E of 12 because it grows slowly but predictably. Always compare P/E to: (1) the company's historical P/E, (2) competitors in the same sector, (3) the broader market average (~20-25).

**Limitations**
P/E uses past earnings. A company could have a low P/E because it just had a one-time windfall — not because it's truly cheap. Some high-growth companies have no earnings yet, making P/E impossible to calculate. P/E is one tool, not the full picture.

**The practical takeaway**
When two similar companies have different P/Es, the market is saying it expects one to grow faster than the other. Whether that expectation is correct is where the investing opportunity lies.`,
    quiz: [
      {
        question: 'A stock priced at $50 earns $5 per share per year. What is its P/E ratio?',
        options: ['5', '10', '50', '250'],
        correct: 1,
        explanation: 'P/E = Price ÷ EPS = $50 ÷ $5 = 10. This means you\'re paying $10 for every $1 of annual earnings.',
      },
      {
        question: 'A company with a very high P/E ratio (e.g. 80) typically means:',
        options: [
          'The company is definitely overpriced',
          'The company has no debt',
          'Investors expect strong future growth',
          'The stock pays large dividends',
        ],
        correct: 2,
        explanation: 'High P/E ratios reflect market expectations of rapid future growth. Investors pay a premium today for expected future earnings.',
      },
      {
        question: 'Why is it important to compare P/E to competitors in the same sector?',
        options: [
          'Because all stocks in a sector have the same P/E',
          'Because different sectors have naturally different P/E ranges',
          'Because P/E only works for certain industries',
          'Because competitors always have lower P/Es',
        ],
        correct: 1,
        explanation: 'A P/E of 15 is high for a utility company but low for a tech company. Sector context is essential for meaningful comparison.',
      },
    ],
  },
  {
    id: 'trading-psychology',
    title: 'The Biggest Enemy in Trading Is You',
    category: 'Psychology',
    difficulty: 'Intermediate',
    readMins: 6,
    emoji: '🧠',
    summary: 'Why smart people make terrible investing decisions — and how to stop.',
    body: `You could know every financial metric, read every earnings report, and still lose money — because of your own brain.

Trading psychology is arguably more important than any technical skill. Here are the key biases that destroy investors:

**1. Loss Aversion**
Studies show people feel the pain of a $100 loss roughly twice as intensely as the pleasure of a $100 gain. This makes us hold losing stocks too long ("it'll come back") and sell winning stocks too early ("I'd better lock in the profit").

**2. FOMO — Fear Of Missing Out**
A stock has gone up 300% this year. Everyone's talking about it. You buy in at the top. It crashes 60%. You just experienced FOMO buying. The time to buy was before everyone was talking about it.

**3. Confirmation Bias**
You believe a stock is great. You then only pay attention to positive news about it and dismiss the negative. You're not analysing — you're rationalising.

**4. Overconfidence**
After a few winning trades, many investors believe they've figured it out. They take larger positions, use more risk. Then the market reminds them it doesn't care about their recent streak.

**5. Herd Mentality**
Buying because everyone else is buying. Selling because everyone else is selling. This is how bubbles form and how people consistently buy high and sell low.

**What to do instead:**
- Write down your reason for buying a stock BEFORE you buy it. Reference it when you're tempted to panic sell.
- Set a target price and a stop-loss price before entering a trade.
- Don't check your portfolio every hour. It encourages emotional decisions.
- Use paper trading (this app) to learn your own emotional patterns before real money is on the line.`,
    quiz: [
      {
        question: 'What is loss aversion?',
        options: [
          'Being afraid to invest at all',
          'Feeling losses more intensely than equivalent gains',
          'Avoiding volatile stocks',
          'Selling stocks when they lose value',
        ],
        correct: 1,
        explanation: 'Loss aversion means the psychological pain of losing $100 is roughly twice as strong as the pleasure of gaining $100. This leads to poor decisions like holding losing stocks too long.',
      },
      {
        question: 'What is confirmation bias in investing?',
        options: [
          'Checking your trade confirmation emails',
          'Only seeking information that supports your existing view',
          'Confirming prices before trading',
          'Waiting for analyst confirmation before buying',
        ],
        correct: 1,
        explanation: 'Confirmation bias means we notice and remember information that agrees with what we already believe, and dismiss information that challenges it.',
      },
      {
        question: 'What is the best way to combat emotional trading decisions?',
        options: [
          'Check your portfolio as often as possible to stay informed',
          'Only invest in stocks you like as a consumer',
          'Write your investment thesis before buying and set target/stop prices',
          'Follow what successful investors on social media are buying',
        ],
        correct: 2,
        explanation: 'Pre-committing to a plan before emotions are involved is the best defence. When you\'re in a trade, your brain is biased. A written plan keeps you rational.',
      },
    ],
  },
  {
    id: 'stop-loss-take-profit',
    title: 'Stop-Loss and Take-Profit: Your Safety Net',
    category: 'Risk',
    difficulty: 'Intermediate',
    readMins: 4,
    emoji: '🛡️',
    summary: 'How to protect your money before a trade goes wrong.',
    body: `The two most important orders in trading aren't "buy" and "sell" — they're **stop-loss** and **take-profit**. Together they define your risk before you enter any position.

**Stop-Loss**
A price level where you automatically sell if the stock drops to it — limiting your loss.

Example: You buy NVDA at $500. You set a stop-loss at $450. If NVDA drops to $450, you're automatically out with a 10% loss. You've defined your worst-case before entering.

Without a stop-loss, many traders watch a 10% loss become 30%, then 50%, waiting for a recovery that may never come.

**Take-Profit**
A price level where you automatically sell if the stock rises to it — locking in your gain.

Example: You buy NVDA at $500 with a take-profit at $600. When NVDA hits $600 (+20%), you're out with your profit secured. You don't have to monitor it constantly.

**The Risk/Reward Ratio**
Professional traders think about every trade in terms of risk vs reward. If your stop-loss is 10% below and your take-profit is 20% above, your risk/reward ratio is 1:2. You risk $1 to potentially make $2.

A general rule: never take a trade with a risk/reward ratio worse than 1:2. This means even if you're only right half the time, you still make money.

**Position Sizing**
How much you put in each trade matters as much as which trades you take. Many professional traders risk no more than 1-2% of their total portfolio on any single trade. That way, even 10 losses in a row only costs you 10-20% of your capital.`,
    quiz: [
      {
        question: 'What does a stop-loss order do?',
        options: [
          'Stops you from buying more shares',
          'Automatically sells your position if price drops to a set level',
          'Freezes your account if you lose too much',
          'Prevents you from making a loss',
        ],
        correct: 1,
        explanation: 'A stop-loss automatically closes your position at a predetermined price, capping your maximum loss on a trade.',
      },
      {
        question: 'Your stop-loss is 5% below your entry, take-profit is 15% above. What is your risk/reward ratio?',
        options: ['1:1', '1:2', '1:3', '3:1'],
        correct: 2,
        explanation: 'Risk is 5%, reward is 15%. 15 ÷ 5 = 3. Risk/reward = 1:3. You risk $1 to potentially make $3.',
      },
      {
        question: 'Why do professional traders limit each trade to 1-2% of their portfolio?',
        options: [
          'It\'s a legal requirement',
          'Small positions always perform better',
          'To survive long losing streaks without catastrophic damage',
          'To reduce brokerage fees',
        ],
        correct: 2,
        explanation: 'Limiting position size means even a bad run of 10 losses only costs 10-20%. Good position sizing is what keeps traders in the game long enough to find their edge.',
      },
    ],
  },
]

export const CATEGORIES: Category[] = ['Basics', 'Strategy', 'Risk', 'Analysis', 'Psychology']

export const CATEGORY_COLORS: Record<Category, string> = {
  Basics:     '#7c3aed',
  Strategy:   '#2563eb',
  Risk:       '#dc2626',
  Analysis:   '#059669',
  Psychology: '#d97706',
}
