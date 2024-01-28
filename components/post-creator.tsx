"use client";

import axios from 'axios';
import { useState, FormEvent, useCallback, useEffect } from "react";


import useBruskiUser from "@/hooks/useBruskiUser";
import useLoginModal from "@/hooks/useLoginModal";
import { usePosts } from "@/hooks/usePosts";
import useRegisterModal from "@/hooks/useRegisterModal";
import { usePost } from "@/hooks/usePost";
import { toast } from "react-hot-toast";
import PostTypeToggles from "@/components/PostTypeToggles";
import { MediaType } from '@prisma/client';
import Avatar from './Avatar';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Pointer } from 'lucide-react';

interface FormProps {
placeholder: string;
isComment?: boolean;
postId?: string;
onPostSubmit: (post: string, mediaType: MediaType) => void;

}

export const PostCreator: React.FC<FormProps> = ({placeholder, isComment, postId, onPostSubmit} ) => {


const [body, setBody] = useState<string>("");


const contentEditableRef = useRef<HTMLDivElement>(null);
const [showPlaceholder, setShowPlaceholder] = useState<boolean>(true)



const { data: currentUser } = useBruskiUser();
const { mutate: mutatePosts } = usePosts();
const [isLoading, setIsLoading] = useState<boolean>(false);

const adjustTextareaHeight = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'; // Reset the height
  textarea.style.height = textarea.scrollHeight + 'px'; // Set the height to match the content
}

// Initialize posts state with data or an empty array to ensure it's always an array
const [posts, setPosts] = useState([]);


const [activePostType, setActivePostType] = useState<MediaType>("TEXT");

// OLD SUBMIT POST
// const onSubmit = useCallback(async (event: FormEvent) => {

//   event.preventDefault();
//   event.stopPropagation();


//   onPostSubmit(body, activePostType);

//   setBody('');

  
//   // try {
//   //   // setIsLoading(true);


//   //   // const url = isComment ? `/api/comments?postId=${postId}` : `/api/posts?media_type=${activePostType}`;

//   //   // const result = await axios.post(url, { body });
//   //   // if(!result) 
//   //   //   return;

    
//   // } catch (error) {
//   //   toast.error('Something went wrong');
//   // } finally {
//   //   // setIsLoading(false);
//   // }


// }, [body, activePostType, onPostSubmit]); 


useEffect(() => {
  // Focus the content editable div when the component mounts
  if (contentEditableRef.current) {
    contentEditableRef.current.focus();
  }
}, []);

const handlePaste = (event: React.ClipboardEvent) => {
  event.preventDefault();
  const text = event.clipboardData?.getData('text/plain');

  const selection = window.getSelection();
  if (!selection?.rangeCount) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();

  const textNode = document.createTextNode(text || ''); // Add a fallback value for text
  range.insertNode(textNode);

  range.selectNodeContents(textNode);
  range.collapse(false);

  setShowPlaceholder(false);
  selection.removeAllRanges();
  selection.addRange(range);
};



const handleClick = (e: React.MouseEvent) => {
  if (showPlaceholder) {
    // Focus the contentEditable div and set the caret to the start
    const editableDiv = contentEditableRef.current;
    if (editableDiv) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(editableDiv, 0);
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }
};

const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    // Submit the form
    onSubmit(e);
  } else if (e.key === 'Enter') {
    e.preventDefault(); // Prevent the default Enter behavior

    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection?.getRangeAt(0);
    range.deleteContents(); // Clear any selected text

    // Create a breakline element
    const breakline = document.createElement('br');
    range.insertNode(breakline);

    // Insert another breakline if at the end of the line in certain browsers
    if (!range.collapsed || !breakline.nextSibling) {
      range.insertNode(document.createElement('br'));
    }

    // Move the cursor to the next line
    range.setStartAfter(breakline);
    range.collapse(true); // Collapse the range to the end point
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
  // Update the placeholder visibility based on the content
  const text = e.target.innerText;
  setShowPlaceholder(text.trim() === '');
};

const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
  // Directly update the body state without preventing the default behavior
  const text = (e.target as HTMLDivElement).innerText;
  setBody(text);
};


const onSubmit = useCallback(async (event: FormEvent) => {
  event.preventDefault();
  onPostSubmit(body, activePostType);
  setBody('');
  setShowPlaceholder(true);

  if (contentEditableRef.current) {
    contentEditableRef.current.innerText = ''; // Reset contenteditable div
  }
}, [body, activePostType, onPostSubmit]);


// useEffect(() => {
//   // Set the activePostType based on some client-side logic or data fetching
//   const initialActivePostType = "CHALLENGE"//getInitialActivePostType(); // Replace with your actual logic
//   setActivePostType(initialActivePostType);
// }, []);


return (
  <div className={"lg:-mt-8 w-full mx-2 rounded-3xl px-4 py-1 mb-4 left-auto right-auto max-w-xl marker:transition-all duration-1000  " + (activePostType == 'CHALLENGE' ? 'ring-4 ring-offset-2 ring-secondary ': '')}>
    
{/* <h3>Create a post</h3> */}
    <div className="flex gap-1 py-4">
      
    <span className={'rounded-full h-12 w-12 grow-0 shrink-0 flex items-center justify-center mt-4 '}><Avatar img={currentUser?.profiles?.[0]?.img ?? "/img/placeholder.svg"} /></span>
  <div className="p-4 rounded-md flex flex-col max-w-2xl grow">
    {/* {activePostType} */}
    {currentUser && (
      <form onSubmit={onSubmit} className='flex flex-col items-end'>
        <div
            ref={contentEditableRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur} // Add onBlur event handler
            onClick={handleClick}
            onPaste={handlePaste}
            contentEditable
            data-placeholder={showPlaceholder ? placeholder : ''} // Add data-placeholder attribute
            role="textbox" // Accessibility role
            aria-multiline="true" // Accessibility attribute
            className={`bg-transparent placeholder w-full min-h-[100px] text-xl font-medium outline-none border-none overflow-y-scroll no-scrollbar max-h-[380px] py-5 px-2 ${showPlaceholder ? '' : 'not-empty'}`}
            

          >

            </div> 
        
        <div className="flex md:flex-row flex-col md:gap-4 gap-2 w-full grow inset-0 md:items-center justify-between items-start">
          <div className='w-fit'><PostTypeToggles onTypeChange={setActivePostType} initial={activePostType} /></div>
          <button type="submit" disabled={!body.length} className="flex items-center gap-2 justify-center bg-primary self-end w-36 h-12 text-primary-foreground btn text-sm rounded-lg font-semibold border-transparent hover:border-primary/70 active:bg-primary/80 border-2 hover:text-primary"><Pointer size={16} />Post</button>
        </div>
        
      </form>
    )}
  </div>

</div>
  </div>
);
}