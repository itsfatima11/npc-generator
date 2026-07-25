import { Wealth } from '../types';
import type { WealthData } from '../types';
export const WEALTH_LEVELS = [
  {id:Wealth.Destitute,name:'Destitute',description:'Lacks reliable shelter, food, and spendable coin.'},
  {id:Wealth.Poor,name:'Poor',description:'Meets only basic needs and is vulnerable to any setback.'},
  {id:Wealth.Modest,name:'Modest',description:'Maintains simple housing, equipment, and a small reserve.'},
  {id:Wealth.Comfortable,name:'Comfortable',description:'Can afford quality necessities and occasional luxuries.'},
  {id:Wealth.Wealthy,name:'Wealthy',description:'Owns significant assets and can employ others.'},
  {id:Wealth.Rich,name:'Rich',description:'Controls major property, investments, or profitable enterprises.'},
  {id:Wealth.VeryRich,name:'Very Rich',description:'Commands dynastic resources capable of influencing regions.'},
] as const satisfies readonly WealthData[];
