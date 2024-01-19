import { useState } from 'react';
import { MediaType } from '@prisma/client';

const PostTypeToggles = ({onTypeChange}: {onTypeChange: (type: MediaType) => void}) => {
  const [activePostType, setActivePostType] = useState('TEXT');

  onTypeChange(activePostType as MediaType);


  return (
    <div className="flex justify-center gap-2 bg-primary-foreground w-fit p-2 rounded-3xl">
      <span
        className={`px-4 py-2 text-sm font-medium rounded-2xl focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 ${activePostType === 'TEXT' ? 'bg-primary/90 text-primary-foreground/70 border-primary/5' : ' text-primary border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
        onClick={() => {setActivePostType('TEXT'); return onTypeChange('TEXT');}}
      >
        Text
      </span>
      {/* TODO: <span
        className={`px-4 py-2 text-sm font-medium text-gray-900 rounded-lg focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 border ${activePostType === 'image' ? 'bg-primary/20 text-primary/70 border-primary/5' : 'border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
        onClick={() => setActivePostType('image')}
      >
        Image
      </span> */}
      <span
        className={`px-4 py-2 text-sm font-medium rounded-2xl focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 ${activePostType === 'CHALLENGE' ? 'bg-primary/90 text-primary-foreground/70 border-primary/5' : ' text-primary border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
        onClick={() => {setActivePostType('CHALLENGE'); return onTypeChange('CHALLENGE');}}
      >
        Challenge
      </span>
      {/* TODO: <span
        className={`px-4 py-2 text-sm font-medium text-gray-900 rounded-lg focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 border ${activePostType === 'video' ? 'bg-primary/20 text-primary/70 border-primary/5' : 'border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
        onClick={() => setActivePostType('video')}
      >
        Video
      </span> */}
    </div>
  );
};

export default PostTypeToggles;
