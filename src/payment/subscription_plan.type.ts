type SubscriptionPlan = "monthly" | "annual";

export function isSubscriptionPlan(plan: string): plan is "monthly" | "annual" {
  return plan === "monthly" || plan === "annual";
}

export default SubscriptionPlan;
