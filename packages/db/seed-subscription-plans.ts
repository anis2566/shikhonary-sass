import { prisma } from "./src";

async function main() {
  console.log("🌱 Seeding subscription plans...");

  // Create FREE plan
  const freePlan = await prisma.subscriptionPlan.upsert({
    where: { name: "FREE" },
    update: {},
    create: {
      name: "FREE",
      displayName: "Free Plan",
      description:
        "Perfect for individual tutors or small coaching centers just getting started",
      monthlyPriceBDT: 0,
      yearlyPriceBDT: 0,
      monthlyPriceUSD: 0,
      yearlyPriceUSD: 0,
      studentLimit: 50,
      teacherLimit: 2,
      storageLimit: 100, // 100 MB
      examLimit: 20,
      features: JSON.stringify({
        smsNotifications: false,
        parentPortal: false,
        customBranding: false,
        advancedReports: false,
        apiAccess: false,
        prioritySupport: false,
      }),
      isActive: true,
      isPopular: false,
    },
  });

  // Create STARTER plan
  const starterPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "STARTER" },
    update: {},
    create: {
      name: "STARTER",
      displayName: "Starter Plan",
      description:
        "Great for small to medium-sized coaching centers ready to grow",
      monthlyPriceBDT: 2000,
      yearlyPriceBDT: 20000, // ~17% discount
      monthlyPriceUSD: 20,
      yearlyPriceUSD: 200,
      studentLimit: 200,
      teacherLimit: 10,
      storageLimit: 1000, // 1 GB
      examLimit: 100,
      features: JSON.stringify({
        smsNotifications: true,
        parentPortal: false,
        customBranding: false,
        advancedReports: false,
        apiAccess: false,
        prioritySupport: false,
      }),
      isActive: true,
      isPopular: false,
    },
  });

  // Create PRO plan
  const proPlan = await prisma.subscriptionPlan.upsert({
    where: { name: "PRO" },
    update: {},
    create: {
      name: "PRO",
      displayName: "Professional Plan",
      description:
        "Ideal for growing schools and coaching centers with advanced features",
      monthlyPriceBDT: 5000,
      yearlyPriceBDT: 50000, // ~17% discount
      monthlyPriceUSD: 50,
      yearlyPriceUSD: 500,
      studentLimit: 500,
      teacherLimit: 50,
      storageLimit: 5000, // 5 GB
      examLimit: 500,
      features: JSON.stringify({
        smsNotifications: true,
        parentPortal: true,
        customBranding: true,
        advancedReports: true,
        apiAccess: false,
        prioritySupport: true,
      }),
      isActive: true,
      isPopular: true, // Most popular plan
    },
  });

  // Create ENTERPRISE plan
  const enterprisePlan = await prisma.subscriptionPlan.upsert({
    where: { name: "ENTERPRISE" },
    update: {},
    create: {
      name: "ENTERPRISE",
      displayName: "Enterprise Plan",
      description:
        "For large institutions requiring unlimited resources and premium support",
      monthlyPriceBDT: 25000,
      yearlyPriceBDT: 250000, // ~17% discount
      monthlyPriceUSD: 250,
      yearlyPriceUSD: 2500,
      studentLimit: 10000,
      teacherLimit: 1000,
      storageLimit: 50000, // 50 GB
      examLimit: 10000,
      features: JSON.stringify({
        smsNotifications: true,
        parentPortal: true,
        customBranding: true,
        advancedReports: true,
        apiAccess: true,
        prioritySupport: true,
        dedicatedAccountManager: true,
        customIntegrations: true,
      }),
      isActive: true,
      isPopular: false,
    },
  });

  console.log("✅ Subscription plans seeded successfully!");
  console.log({
    freePlan: freePlan.name,
    starterPlan: starterPlan.name,
    proPlan: proPlan.name,
    enterprisePlan: enterprisePlan.name,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
