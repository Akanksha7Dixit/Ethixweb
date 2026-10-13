import {MessageCircle,Workflow,Globe,Code2,Plug,Search,Megaphone,BarChart3,LifeBuoy} from 'lucide-react';
const M={MessageCircle,Workflow,Globe,Code2,Plug,Search,Megaphone,BarChart3,LifeBuoy};
export const Icon=({n})=>{const C=M[n]||Globe;return <span className="ico"><C size={22} strokeWidth={1.6}/></span>};
