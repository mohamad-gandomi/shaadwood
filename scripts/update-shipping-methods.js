const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚚 Updating and Persianizing Shipping Methods in database...');

  // Remove existing or clear to recreate clean list
  await prisma.shippingMethod.deleteMany();

  const methods = [
    {
      name: 'باربری اختصاصی مبلمان (هماهنگی و استعلام تلفنی هزینه)',
      type: 'FIXED',
      price: 0,
      currency: 'IRR',
      carrier: 'باربری تخصصی مبلمان و دکوراسیون (پس‌کرایه)',
      estimatedDays: '۳ الی ۵ روز کاری',
      description:
        'هزینه باربری بر اساس شهر، طبقه و مسافت، پس از ثبت سفارش محاسبه و به صورت تلفنی با شما هماهنگ خواهد شد (پرداخت کرایه حمل به صورت پس‌کرایه هنگام تحویل کالا).',
      isActive: true,
      isDefault: true,
      displayOrder: 1,
    },
    {
      name: 'ارسال سریع تیپاکس / چاپار (بسته‌های سبک و اکسسوری)',
      type: 'FIXED',
      price: 150000,
      currency: 'IRR',
      carrier: 'تیپاکس اکسپرس / شرکت چاپار',
      estimatedDays: '۱ الی ۳ روز کاری',
      description:
        'ارسال سریع قطعات کوچک، اکسسوری‌های چوبی، پاتختی و کاتالوگ با بسته‌بندی حباب‌دار ایمن و کد رهگیری پستی به سراسر کشور.',
      isActive: true,
      isDefault: false,
      displayOrder: 2,
    },
    {
      name: 'تحویل حضوری در شوروم و کارگاه مرکزی شادوود',
      type: 'LOCAL_PICKUP',
      price: 0,
      currency: 'IRR',
      carrier: 'تحویل حضوری (کارگاه و شوروم شادوود)',
      estimatedDays: '۱ الی ۲ روز کاری',
      description:
        'تحویل مستقیم سفارش از کارگاه درودگری و شوروم اختصاصی شادوود همراه با هماهنگی زمان و پشتیبانی در بارگیری ایمن.',
      isActive: true,
      isDefault: false,
      displayOrder: 3,
    },
  ];

  for (const m of methods) {
    const created = await prisma.shippingMethod.create({ data: m });
    console.log(`  ✓ Created shipping method: ${created.name} (Price: ${created.price})`);
  }

  console.log('✅ All shipping methods updated and Persianized successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error updating shipping methods:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
