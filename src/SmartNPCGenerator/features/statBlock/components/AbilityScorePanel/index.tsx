import type { AbilityScores } from '../../types';
const sign=(value:number)=>value>=0?`+${value}`:String(value);
export function AbilityScorePanel({scores}:{readonly scores:AbilityScores}){return <section className="stat-abilities" aria-label="Ability scores">{Object.values(scores).map(score=><article key={score.ability}><span>{score.ability.slice(0,3)}</span><strong>{score.score}</strong><b>{sign(score.modifier)}</b><small>{score.evidence.join(', ')||'Baseline'}</small></article>)}</section>}
