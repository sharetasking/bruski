const LandingPageLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <main className="flex w-full justify-center max-w-7xl m-auto flex-1 grow">
      {children}
    </main>
   );
}
 
export default LandingPageLayout;