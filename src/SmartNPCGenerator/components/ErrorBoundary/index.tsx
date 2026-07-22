import { Component,type ErrorInfo,type ReactNode } from 'react';
import { logError } from '../../infrastructure/logger';

interface Props {readonly children:ReactNode}
interface State {readonly failed:boolean}
export class ErrorBoundary extends Component<Props,State>{
  state:State={failed:false};
  static getDerivedStateFromError():State{return{failed:true};}
  componentDidCatch(error:Error,info:ErrorInfo):void{logError('ui.render-failure',error,{componentStack:info.componentStack?.slice(0,500)??null});}
  render():ReactNode{if(this.state.failed)return <main className="app-fatal" role="alert"><div><span className="eyebrow">Smart NPC Studio</span><h1>The studio could not finish loading.</h1><p>Your saved workspace remains in browser storage. Retry the interface; if the problem continues, export a workspace backup after reloading.</p><button onClick={()=>this.setState({failed:false})}>Retry</button><button onClick={()=>window.location.reload()}>Reload Application</button></div></main>;return this.props.children;}
}
