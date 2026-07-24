import { motion } from 'framer-motion';
import { ArrowRight, Braces, CheckCircle2, Code2, Crown, Gauge, Radio, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  { icon: Code2, title: 'Code for precision', copy: 'Turn elegant ideas into the shortest correct programs.' },
  { icon: Radio, title: 'Compete live', copy: 'Race your friends in real-time rooms and track every move.' },
  { icon: Crown, title: 'Climb the ranks', copy: 'Accepted code is ranked by its byte count — shortest wins.' },
];

const problems = [
  ['Sum Two Numbers', 'Easy', 'Strings · Math', '1,248'],
  ['Reverse a Word', 'Easy', 'Arrays · Strings', '986'],
  ['Prime Sprint', 'Medium', 'Math · Loops', '734'],
];

const reveal = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };

export const LandingPage = () => (
  <>
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow hero-glow-one" aria-hidden="true" />
      <div className="hero-glow hero-glow-two" aria-hidden="true" />
      <div className="container hero-content">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.1 }}>
          <motion.div variants={reveal} className="live-pill"><span className="pulse-dot" /> REAL-TIME CODE GOLF</motion.div>
          <motion.h1 variants={reveal}>Write less.<br /><span>Outsmart more.</span></motion.h1>
          <motion.p variants={reveal} className="hero-copy">Compete in real-time coding battles where every byte counts. Solve smart, write small, and claim the arena.</motion.p>
          <motion.div variants={reveal} className="hero-actions">
            <Link className="button button-primary" to="/problems">Start coding <ArrowRight size={17} /></Link>
            <Link className="button button-secondary" to="/arena"><Users size={17} /> Join a room</Link>
          </motion.div>
          <motion.div variants={reveal} className="hero-proof">
            <span><CheckCircle2 size={16} /> Instant leaderboard</span>
            <span><CheckCircle2 size={16} /> Judge0-powered runs</span>
          </motion.div>
        </motion.div>

        <motion.div className="editor-preview" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
          <div className="editor-top"><span><i /> <i /> <i /></span><span>sum_two_numbers.py</span><span className="editor-language">Python</span></div>
          <pre><code><em>1</em><span className="purple">a</span>,<span className="purple">b</span>=<span className="blue">map</span>(<span className="blue">int</span>,<span className="blue">input</span>().<span className="blue">split</span>()){`\n`}<em>2</em><span className="blue">print</span>(a+b)</code></pre>
          <div className="editor-result"><span className="status-success"><CheckCircle2 size={15} /> Accepted</span><span>12 bytes</span><span>0.03 s</span></div>
        </motion.div>
      </div>
    </section>

    <section className="section container feature-section">
      <div className="section-heading"><div><p className="eyebrow">THE ARENA</p><h2>Competitive programming, stripped to its essence.</h2></div></div>
      <div className="feature-grid">
        {features.map(({ icon: Icon, title, copy }) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={21} /></span><h3>{title}</h3><p>{copy}</p></article>)}
      </div>
    </section>

    <section className="section challenge-section"><div className="container two-column">
      <article className="daily-card"><div className="daily-top"><span className="eyebrow">DAILY CHALLENGE</span><span className="difficulty medium">MEDIUM</span></div><h2>Palindrome Protocol</h2><p>Can you determine whether a string reads the same forwards and backwards — with the fewest bytes?</p><div className="challenge-meta"><span><Gauge size={16} /> 23 byte record</span><span><Users size={16} /> 1,842 attempts</span></div><Link to="/problems" className="text-link">Take the challenge <ArrowRight size={16} /></Link></article>
      <div className="problem-preview"><div className="preview-heading"><div><p className="eyebrow">PRACTICE PROBLEMS</p><h2>Sharpen your edge</h2></div><Link to="/problems" className="text-link">View all <ArrowRight size={16} /></Link></div>{problems.map(([title, difficulty, tags, attempts], index) => <div className="problem-row" key={title}><span className="problem-number">{String(index + 1).padStart(2, '0')}</span><div><h3>{title}</h3><p>{tags}</p></div><span className="difficulty easy">{difficulty}</span><span className="attempts">{attempts} solves</span></div>)}</div>
    </div></section>

    <section className="section container leaderboard-section"><div className="leaderboard-copy"><p className="eyebrow">LIVE LEADERBOARD</p><h2>Every character<br />changes the game.</h2><p>Score a correct solution, then keep shaving bytes. The arena ranks every accepted solution live.</p><Link className="button button-secondary" to="/arena">Watch the arena <ArrowRight size={17} /></Link></div><div className="leaderboard-card"><div className="leaderboard-title"><span><Radio size={15} /> LIVE NOW</span><span>Byte count</span></div>{[['1','byte_bender','34','gold'],['2','NullPointer','41','silver'],['3','snake_case','48','bronze'],['4','AdaLovelace','53',''],['5','loop_lord','67','']].map(([rank, name, score, tone]) => <div className="leaderboard-row" key={name}><span className={`rank ${tone}`}>{rank}</span><span className="avatar">{name.slice(0, 1).toUpperCase()}</span><strong>{name}</strong><span className="score">{score} <small>bytes</small></span></div>)}</div></section>

    <section className="cta-section"><div className="container"><Braces size={30} /><h2>Ready to make every byte count?</h2><p>Find a problem, open a room, and write your way to the top.</p><Link className="button button-primary" to="/problems">Enter Code Golf Arena <ArrowRight size={17} /></Link></div></section>
  </>
);
