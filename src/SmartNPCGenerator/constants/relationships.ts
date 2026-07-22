import type { RelationshipPromptData } from '../types';

export const RELATIONSHIP_PROMPTS = [
  {id:'protective-parent',label:'Protective parent',description:'Offers fierce support but struggles to allow independence.'},
  {id:'estranged-parent',label:'Estranged parent',description:'A long separation has left important matters unresolved.'},
  {id:'competitive-sibling',label:'Competitive sibling',description:'Affection and rivalry are tightly intertwined.'},
  {id:'dependent-sibling',label:'Dependent sibling',description:'Relies on the NPC for safety, money, or guidance.'},
  {id:'trusted-friend',label:'Trusted friend',description:'Knows the NPC well enough to challenge their excuses.'},
  {id:'former-friend',label:'Former friend',description:'Shared history has curdled into distance or resentment.'},
  {id:'reluctant-ally',label:'Reluctant ally',description:'Cooperates because circumstances leave no better option.'},
  {id:'political-ally',label:'Political ally',description:'Provides influence in exchange for dependable support.'},
  {id:'professional-rival',label:'Professional rival',description:'Competes for recognition, clients, or advancement.'},
  {id:'ideological-rival',label:'Ideological rival',description:'Shares an objective but rejects the NPC’s methods.'},
  {id:'open-enemy',label:'Open enemy',description:'Publicly works to defeat or disgrace the NPC.'},
  {id:'hidden-enemy',label:'Hidden enemy',description:'Appears friendly while quietly undermining the NPC.'},
  {id:'demanding-mentor',label:'Demanding mentor',description:'Offers valuable instruction at a personal cost.'},
  {id:'disgraced-mentor',label:'Disgraced mentor',description:'Once inspired the NPC but now carries a ruined reputation.'},
  {id:'promising-student',label:'Promising student',description:'Shows exceptional talent but lacks judgment.'},
  {id:'rebellious-student',label:'Rebellious student',description:'Questions every lesson and may surpass the NPC.'},
  {id:'unspoken-love',label:'Unspoken love',description:'Strong feelings remain hidden behind caution or duty.'},
  {id:'former-lover',label:'Former lover',description:'Old intimacy complicates every present interaction.'},
  {id:'arranged-partner',label:'Arranged partner',description:'Family or politics created the match before affection.'},
  {id:'impossible-love',label:'Impossible love',description:'Status, allegiance, distance, or danger prevents an open bond.'},
] as const satisfies readonly RelationshipPromptData[];
