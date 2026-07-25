import { SocialStatus } from '../types';
import type { SocialStatusData } from '../types';
export const SOCIAL_STATUSES = [
  {id:SocialStatus.LowerClass,name:'Poor',description:'Lives with few resources and little institutional influence.'},
  {id:SocialStatus.WorkingClass,name:'Working Class',description:'Supports a household through regular skilled or physical labor.'},
  {id:SocialStatus.MiddleClass,name:'Middle Class',description:'Maintains stable means, useful connections, and modest local influence.'},
  {id:SocialStatus.Merchant,name:'Merchant',description:'Holds status through trade, credit, guild ties, or commercial reach.'},
  {id:SocialStatus.UpperClass,name:'Wealthy',description:'Possesses substantial property, privilege, and social access.'},
  {id:SocialStatus.MinorNoble,name:'Minor Noble',description:'Holds a lesser title, estate, or inherited local privilege.'},
  {id:SocialStatus.Noble,name:'Noble',description:'Belongs to a recognized ruling or landholding house.'},
  {id:SocialStatus.Royalty,name:'Royalty',description:'Is part of a sovereign dynasty or its immediate household.'},
  {id:SocialStatus.Criminal,name:'Criminal',description:'Derives standing from an illicit network or feared reputation.'},
  {id:SocialStatus.Outcast,name:'Outcast',description:'Has been formally or informally excluded from a community.'},
  {id:SocialStatus.Hermit,name:'Hermit',description:'Lives apart from ordinary society by choice or necessity.'},
] as const satisfies readonly SocialStatusData[];
