import { SubscriptionButton } from "@/components/subscription-button";
import { checkSubscription } from "@/lib/subscription";

const SettingsPage = async () => {
  console.log("SettingsPage");
  const isPro = await checkSubscription();
  console.log("isPro", isPro);

  return ( 
    <div className="h-full fadeInUp grow max-w-5xl p-4 space-y-2">
      <h2 className="">Settings</h2>
      <div className="text-muted-foreground text-sm">
        {isPro ? "You are currently on a Pro plan." : "You are currently on a free plan."}
      </div>
      <SubscriptionButton isPro={isPro} />
    </div>
   );
}
 
export default SettingsPage;
