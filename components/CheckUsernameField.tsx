// import { FormDescription, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { useForm } from 'react-hook-form';
// import axios from "axios";
// import { useState, useCallback } from "react";
// import { debounce } from "lodash";
// import { useEffect } from "react";

// const CreateUsernameField = async () => {
  
//   const [username, setUsername] = useState('');

//   // Define checkUsernameAvailability normally, not as an async arrow function
//   const checkUsernameAvailability = async (username: string) => {
//     try {
//       const response = await axios.get(`/api/check-username?username=${username}`);
//       console.log(response);
//       // Handle response - update the state/UI based on whether the username is available
//     } catch (error) {
//       // Handle error
//     }
//   };

//     // Setup useCallback with a dependency array
//     const debouncedCheckUsername = useCallback(
//       debounce((newUsername:string) => checkUsernameAvailability(newUsername), 500),
//       [] // Empty dependency array because debounce and checkUsernameAvailability do not change
//     );

//     // Make sure to cancel any pending operations if the component unmounts
//     useEffect(() => {
//       return () => {
//         debouncedCheckUsername.cancel();
//       };
//     }, [debouncedCheckUsername]);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const selectedUsername = e.target.value;
//       // setUsername(selectedUsername);
//       debouncedCheckUsername(selectedUsername);
//     };


  

//   return (
//     <>
//     Select a username
//       <input onChange={handleChange} type="text" placeholder="Username" className="w-full p-4 bg-primary/5 rounded-lg text-primary/80 text-xl font-semibold" />
//       {/* <FormField
//         name="name"
//         // control={form.control}
//         render={() => (
//           <FormItem className="col-span-2 md:col-span-1">
//             <FormLabel>Name</FormLabel>
//             <FormControl>
//               <Input placeholder="Cristiano Ronaldo" value="Howdy" />
//             </FormControl>
//             <FormDescription>
//               This is how your AI Companion will be named.
//             </FormDescription>
//             <FormMessage />
//           </FormItem>
//         )}
//       /> */}
//     </>
  
//   );
// }
 
// export default CreateUsernameField;