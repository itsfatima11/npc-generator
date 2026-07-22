import type { QuestDifficulty } from '../../types';
const rank:Record<QuestDifficulty,number>={easy:1,medium:2,hard:3,deadly:4};
export function DifficultyIndicator({difficulty}:{readonly difficulty:QuestDifficulty}){return <div className={`quest-difficulty quest-difficulty--${difficulty}`} aria-label={`${difficulty} difficulty`}><span>{difficulty}</span><i>{Array.from({length:4},(_,index)=><b className={index<rank[difficulty]?'active':''} key={index}/>)}</i></div>}
