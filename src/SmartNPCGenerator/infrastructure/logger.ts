export type LogLevel='info'|'warning'|'error';
export interface LogEvent {readonly level:LogLevel;readonly code:string;readonly message:string;readonly timestamp:string;readonly context?:Readonly<Record<string,string|number|boolean|null>>}
export interface Logger {write(event:LogEvent):void}
class ConsoleLogger implements Logger {write(event:LogEvent):void{const method=event.level==='error'?console.error:event.level==='warning'?console.warn:console.info;method('[Smart NPC Studio]',event);}}
export const logger:Logger=new ConsoleLogger();
export function logError(code:string,reason:unknown,context?:LogEvent['context']):void{logger.write({level:'error',code,message:reason instanceof Error?reason.message:'Unexpected application failure.',timestamp:new Date().toISOString(),context});}
