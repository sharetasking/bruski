import { Toaster } from 'react-hot-toast';

const AuthLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="flex justify-center items-center w-full h-full">
      {children}

      <Toaster />
    </div>
   );
}
 
export default AuthLayout;