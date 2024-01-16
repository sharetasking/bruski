import { Toaster } from "react-hot-toast"

const initialize = ({children}: {children: React.ReactNode}) => {
  return ( <>
  
{children}  

<Toaster />
  </> );
}
 
export default initialize;