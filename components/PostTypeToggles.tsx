import { useState } from 'react';

const PostTypeToggles = ({onTypeChange}: {onTypeChange: (type: string) => void}) => {
  const [activePostType, setActivePostType] = useState('TEXT');

  onTypeChange(activePostType);


  return (
    <div className="flex justify-center gap-2 my-4">
      <span
        className={`px-4 py-2 text-sm font-medium text-primary/70 rounded-lg focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 border ${activePostType === 'TEXT' ? 'bg-primary/20 text-primary/70 border-primary/5' : 'border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
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
        className={`px-4 py-2 text-sm font-medium text-primary/70 rounded-lg focus:outline-none focus:ring-2 cursor-pointer focus:ring-indigo-500 transition-all duration-200 border ${activePostType === 'CHALLENGE' ? 'bg-primary/20 text-primary/70 border-primary/5' : 'border-transparent hover:bg-primary/10 hover:text-primary/30 active:bg-primary/30'}`}
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
