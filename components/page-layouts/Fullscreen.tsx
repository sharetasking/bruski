
import { Toaster } from 'react-hot-toast';
const FullScreenLayout: React.FC<{ children: React.ReactNode }>  = ({children}) => {
  return ( <>{children}
  
  <Toaster />
  </> );
}
 
export default FullScreenLayout;