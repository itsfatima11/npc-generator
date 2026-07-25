import { BodyBuild } from '../types';
import type { BodyBuildData } from '../types';
export const BODY_BUILDS = [
  {id:BodyBuild.Slim,name:'Slim',description:'Narrow-framed with little visible bulk.'},{id:BodyBuild.Athletic,name:'Athletic',description:'Conditioned, balanced, and visibly active.'},
  {id:BodyBuild.Average,name:'Average',description:'Neither notably slight nor heavy for their ancestry.'},{id:BodyBuild.Heavy,name:'Heavy',description:'Broad and weighty with a substantial frame.'},
  {id:BodyBuild.Muscular,name:'Muscular',description:'Powerfully developed through labor or training.'},{id:BodyBuild.Large,name:'Large',description:'Unusually tall, broad, or imposing for their ancestry.'},
  {id:BodyBuild.Stocky,name:'Stocky',description:'Compact, broad, and solidly built.'},{id:BodyBuild.Lean,name:'Lean',description:'Low in body fat with wiry definition.'},
] as const satisfies readonly BodyBuildData[];
