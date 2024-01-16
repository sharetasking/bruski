import { HashLoader } from "react-spinners"

export default function Loading({color="#63636366"})
{

  return (<div className="w-full h-full flex justify-center items-center grow flex-1 inset-0"><HashLoader color={color} className="m-auto" /></div>)
}