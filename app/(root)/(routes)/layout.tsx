const LandingPageLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <main className="flex w-full justify-center flex-1 grow">
      {children}
    </main>
   );
}
 
export default LandingPageLayout;