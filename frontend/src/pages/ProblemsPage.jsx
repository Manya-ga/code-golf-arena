import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronLeft, ChevronRight, CircleDotDashed, Search, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

import { apiRequest } from '../services/api';

const pageSize = 8;
const difficultyOptions = ['All difficulties', 'Easy', 'Medium', 'Hard'];

const presentationDifficulty = (problem) => {
  const wordCount = problem.description?.split(/\s+/).length ?? 0;
  return wordCount > 75 ? 'Medium' : 'Easy';
};

const ProblemSkeleton = () => <div className="problems-table" aria-label="Loading problems">
  {[...Array(5)].map((_, index) => <div className="problem-table-row skeleton-row" key={index}><span /><span /><span /><span /><span /></div>)}
</div>;

export const ProblemsPage = () => {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All difficulties');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('title');
  const { data: problems = [], isPending, isError, error } = useQuery({ queryKey: ['problems'], queryFn: () => apiRequest('/problems') });

  const visibleProblems = useMemo(() => {
    const searched = problems.filter((problem) => {
      const matchesQuery = `${problem.title} ${problem.description} ${(problem.supportedLanguages ?? []).join(' ')}`.toLowerCase().includes(query.toLowerCase());
      return matchesQuery && (difficulty === 'All difficulties' || presentationDifficulty(problem) === difficulty);
    });
    return [...searched].sort((left, right) => sort === 'title' ? left.title.localeCompare(right.title) : presentationDifficulty(left).localeCompare(presentationDifficulty(right)));
  }, [problems, query, difficulty, sort]);

  const totalPages = Math.max(1, Math.ceil(visibleProblems.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedProblems = visibleProblems.slice((safePage - 1) * pageSize, safePage * pageSize);
  const updateFilter = (value) => { setDifficulty(value); setPage(1); };

  return <section className="problems-page container">
    <div className="page-heading"><div><p className="eyebrow">PROBLEM LIBRARY</p><h1>Find your next <span>byte battle.</span></h1><p>Practice against the same Judge0-backed challenges used in the multiplayer arena.</p></div><Link className="button button-primary" to="/arena"><CircleDotDashed size={17} /> Create room</Link></div>

    <div className="problem-toolbar"><label className="search-field"><Search size={18} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search problems" aria-label="Search problems" /></label><div className="filter-group"><SlidersHorizontal size={16} /><select value={difficulty} onChange={(event) => updateFilter(event.target.value)} aria-label="Filter by difficulty">{difficultyOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={15} /></div><div className="sort-group"><span>Sort:</span><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort problems"><option value="title">Title</option><option value="difficulty">Difficulty</option></select></div></div>

    <div className="problem-list-card">
      <div className="problem-table-head"><span>Status</span><span>Title</span><span>Difficulty</span><span>Languages</span><span className="align-right">Details</span></div>
      {isPending ? <ProblemSkeleton /> : isError ? <div className="problem-error"><strong>Couldn’t load the problem library.</strong><span>{error.message}</span><p>Start the existing backend and seed its database, then try again.</p></div> : <div className="problems-table">{paginatedProblems.map((problem) => <article className="problem-table-row" key={problem._id}><span className="problem-status" title="Active"><CircleDotDashed size={17} /></span><div className="problem-title"><Link to="/arena">{problem.title}</Link><p>{problem.outputDescription || 'Open a room to solve this challenge.'}</p></div><span className={`difficulty ${presentationDifficulty(problem).toLowerCase()}`}>{presentationDifficulty(problem)}</span><div className="language-tags">{problem.supportedLanguages?.slice(0, 3).map((language) => <span key={language}>{language}</span>)}</div><Link className="open-problem align-right" to="/arena">Open <ChevronRight size={16} /></Link></article>)}{paginatedProblems.length === 0 && <div className="empty-state"><Search size={22} /><strong>No challenges match those filters.</strong><span>Try a broader search or reset the difficulty filter.</span></div>}</div>}
    </div>
    {!isPending && !isError && <div className="pagination"><span>Showing {visibleProblems.length ? (safePage - 1) * pageSize + 1 : 0}–{Math.min(safePage * pageSize, visibleProblems.length)} of {visibleProblems.length} challenges</span><div><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={safePage === 1} aria-label="Previous page"><ChevronLeft size={18} /></button><strong>{safePage}</strong><span>/ {totalPages}</span><button type="button" onClick={() => setPage((value) => Math.min(totalPages, value + 1))} disabled={safePage === totalPages} aria-label="Next page"><ChevronRight size={18} /></button></div></div>}
    <p className="metadata-note">Difficulty, tags, acceptance rates, and companies are not yet supplied by the existing API. The current difficulty label is a visual estimate based on problem length and will be replaced when backend metadata is available.</p>
  </section>;
};
