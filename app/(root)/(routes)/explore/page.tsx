const ExplorePage = () => {
  return (
  
  <div className="h-full p-4 flex md:flex-row flex-col space-y-2">
  {/* Left Column */}
    <div className="flex flex-col md:w-96 h-full gap-2">
      <div className="font-semibold">What&apos;s Brewing</div>
      <div className="h-48 rounded-md bg-secondary gap-4 flex flex-col">
        <div className="flex flex-col justify-start p-4 items-start gap-2 h-full">
          <span className="text-primary/90">#politics</span>
          <div className="text-xl font-semibold w-full line-clamp-3">Matt Damon is quoted as saying he wants Hillary Clinton to run for president for a 3rd time in 2024.</div>
           <div className="text-sm text-muted-foreground mr-auto line-clamp-2"><span className="font-semibold text-gray-700 ">4k+ people</span> have commented on this</div>
        </div>

        <button className="btn bg-primary/60 text-white/50  -mt-6 z-10 hover:bg-primary/80 active:bg-primary py-4 px-4 rounded-full cursor-pointer w-fit">Chime In</button>
      </div>
    </div>


    {/* Right COlumn */}
    <div className="flex flex-col h-full grow px-4 gap-2">

      {/* Suggested Accounts */}
      <div>
        <h2 className="font-semibold">Suggested Accounts</h2>
        <div className="flex gap-2 h-48">
          <div className="w-36 bg-primary/10 rounded-md"></div>
          <div className="w-36 bg-primary/10 rounded-md"></div>
          <div className="w-36 bg-primary/10 rounded-md"></div>
        </div>
      </div>

    </div>
  </div>



  );
}

export default ExplorePage;