import { Toaster } from 'react-hot-toast';

const ChatLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="mx-auto max-w-4xl h-full w-full">
      {children}

      <Toaster />
    </div>
  );
}

export default ChatLayout;
