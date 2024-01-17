const LandingPageLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <main className="h-full w-full grow">
      {children}
    </main>
   );
}
 
export default LandingPageLayout;