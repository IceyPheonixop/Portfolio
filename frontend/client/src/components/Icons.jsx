import * as Icons from 'lucide-react'; export const Icon = ({ name, ...props }) => { const C = Icons[name] || Icons.Circle; return <C {...props} />; };
