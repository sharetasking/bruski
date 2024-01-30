import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

const ChatLayout = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="mx-auto max-w-4xl h-full w-full">
      <Script async src="https://cdn.promotekit.com/promotekit.js" data-promotekit="6da74517-fad2-47fc-a0fe-7fa7daa0be76"></Script>
      {children}

      <Toaster />
    </div>
  );
}

export default ChatLayout;
