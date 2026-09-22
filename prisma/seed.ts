import { PrismaClient, Role, ProductType, ProductStatus, PostStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Shaadwood Furniture database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.media.deleteMany();
  await prisma.variantAttributeValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned previous data.');

  // 2. Create Users (Admin & Customer)
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@shaadwood.com',
      passwordHash: adminPasswordHash,
      firstName: 'Shaad',
      lastName: 'Admin',
      phone: '+1 555-0199',
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'customer@shaadwood.com',
      passwordHash: customerPasswordHash,
      firstName: 'Alexander',
      lastName: 'Wright',
      phone: '+1 555-0245',
      role: Role.CUSTOMER,
      addresses: {
        create: [
          {
            title: 'Home Residence',
            recipientName: 'Alexander Wright',
            phone: '+1 555-0245',
            street: '742 Evergreen Terrace',
            city: 'Portland',
            province: 'Oregon',
            postalCode: '97201',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
        ],
      },
    },
  });

  console.log(`👤 Users seeded: Admin (${admin.email}), Customer (${customer.email})`);

  // 3. Hierarchical Categories for Furniture
  const livingRoom = await prisma.category.create({
    data: {
      name: 'Living Room',
      slug: 'living-room',
      description: 'Handcrafted sofas, lounge chairs, and coffee tables built for elegance and comfort.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      displayOrder: 1,
    },
  });

  const sofasCategory = await prisma.category.create({
    data: {
      name: 'Sofas & Armchairs',
      slug: 'sofas-and-armchairs',
      description: 'Custom upholstered seating and accent armchairs.',
      parentId: livingRoom.id,
      displayOrder: 1,
    },
  });

  const diningRoom = await prisma.category.create({
    data: {
      name: 'Dining Room',
      slug: 'dining-room',
      description: 'Solid wood dining tables, benches, and ergonomic dining chairs.',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
      displayOrder: 2,
    },
  });

  const diningTablesCategory = await prisma.category.create({
    data: {
      name: 'Dining Tables',
      slug: 'dining-tables',
      description: 'Hand-finished hardwood dining tables designed to last generations.',
      parentId: diningRoom.id,
      displayOrder: 1,
    },
  });

  console.log('🛋️ Categories seeded (Hierarchical).');

  // 4. Attributes & Values (WooCommerce Style)
  const woodFinishAttr = await prisma.attribute.create({
    data: {
      name: 'Wood Finish',
      slug: 'wood-finish',
      values: {
        create: [
          { name: 'Solid American Walnut', value: 'walnut', colorHex: '#5C4033' },
          { name: 'Natural White Oak', value: 'natural-oak', colorHex: '#C8AD7F' },
          { name: 'Smoked Teak', value: 'smoked-teak', colorHex: '#3D2817' },
        ],
      },
    },
    include: { values: true },
  });

  const fabricColorAttr = await prisma.attribute.create({
    data: {
      name: 'Fabric Color',
      slug: 'fabric-color',
      values: {
        create: [
          { name: 'Forest Velvet', value: 'forest-velvet', colorHex: '#1E3F20' },
          { name: 'Ivory Linen', value: 'ivory-linen', colorHex: '#F5F2EB' },
          { name: 'Charcoal Grey', value: 'charcoal-grey', colorHex: '#36454F' },
        ],
      },
    },
    include: { values: true },
  });

  const materialAttr = await prisma.attribute.create({
    data: {
      name: 'Material & Joinery',
      slug: 'material-and-joinery',
      values: {
        create: [
          { name: 'Solid European White Oak', value: 'solid-oak', colorHex: '#C8AD7F' },
          { name: 'Solid American Black Walnut', value: 'solid-walnut', colorHex: '#5C4033' },
          { name: 'Danish Kiln-Dried Teak', value: 'danish-teak', colorHex: '#8B5A2B' },
        ],
      },
    },
    include: { values: true },
  });

  console.log('🎨 Global Attributes & Values seeded.');

  // 5. Products
  // A. Variable Product: Nordic Lounge Armchair
  const variableArmchair = await prisma.product.create({
    data: {
      name: 'Nordic Minimalist Lounge Armchair',
      slug: 'nordic-minimalist-lounge-armchair',
      sku: 'SW-ARMCHAIR-01',
      productType: ProductType.VARIABLE,
      description:
        'A sculptured Danish-modern lounge chair celebrating clean lines, organic curves, and heirloom-grade joinery. Built from kiln-dried hardwood with premium velvet or breathable linen upholstery.',
      shortDescription: 'Modern Scandinavian armchair with customizable hardwood frame and upholstery.',
      basePrice: 450.0,
      dimensions: '82x86x78 cm',
      weight: 18.5,
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: sofasCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
            altText: 'Nordic Minimalist Lounge Armchair Front View',
            isPrimary: true,
            displayOrder: 1,
          },
          {
            url: 'https://images.unsplash.com/photo-1580481077198-1329621379c6',
            altText: 'Nordic Minimalist Lounge Armchair Profile Angle',
            isPrimary: false,
            displayOrder: 2,
          },
        ],
      },
      attributes: {
        create: [
          { attributeId: woodFinishAttr.id, isVariation: true },
          { attributeId: fabricColorAttr.id, isVariation: true },
        ],
      },
    },
  });

  // Map values for easy lookup
  const valMap: Record<string, string> = {};
  for (const v of [...woodFinishAttr.values, ...fabricColorAttr.values]) {
    valMap[v.value] = v.id;
  }

  // Create Variations for Armchair (e.g., combinations of finish & fabric)
  const variantsData = [
    {
      sku: 'SW-ARM-WAL-FOR',
      price: 530.0,
      salePrice: 490.0,
      stock: 8,
      finish: 'walnut',
      fabric: 'forest-velvet',
    },
    {
      sku: 'SW-ARM-WAL-IVO',
      price: 495.0,
      salePrice: null,
      stock: 14,
      finish: 'walnut',
      fabric: 'ivory-linen',
    },
    {
      sku: 'SW-ARM-WAL-CHA',
      price: 495.0,
      salePrice: null,
      stock: 9,
      finish: 'walnut',
      fabric: 'charcoal-grey',
    },
    {
      sku: 'SW-ARM-OAK-FOR',
      price: 480.0,
      salePrice: null,
      stock: 15,
      finish: 'natural-oak',
      fabric: 'forest-velvet',
    },
    {
      sku: 'SW-ARM-OAK-IVO',
      price: 450.0,
      salePrice: 420.0,
      stock: 22,
      finish: 'natural-oak',
      fabric: 'ivory-linen',
    },
    {
      sku: 'SW-ARM-OAK-CHA',
      price: 450.0,
      salePrice: null,
      stock: 11,
      finish: 'natural-oak',
      fabric: 'charcoal-grey',
    },
  ];

  for (const item of variantsData) {
    await prisma.productVariant.create({
      data: {
        productId: variableArmchair.id,
        sku: item.sku,
        price: item.price,
        salePrice: item.salePrice,
        stockQuantity: item.stock,
        weight: 18.5,
        dimensions: '82x86x78 cm',
        attributeValues: {
          create: [
            { attributeValueId: valMap[item.finish] },
            { attributeValueId: valMap[item.fabric] },
          ],
        },
      },
    });
  }

  // B. Simple Product: Solid Oak Dining Table
  await prisma.product.create({
    data: {
      name: 'Aalborg Solid White Oak Dining Table (8-Seater)',
      slug: 'aalborg-solid-white-oak-dining-table',
      sku: 'SW-DT-001',
      productType: ProductType.SIMPLE,
      description:
        'Crafted from selected European White Oak planks with a natural low-sheen hardwax oil finish. Seats 8-10 comfortably with chamfered edge profiling and interlocking trestle joinery.',
      shortDescription: 'Generous 8-10 person dining table handcrafted from solid European White Oak.',
      basePrice: 1250.0,
      salePrice: 1099.0,
      stockQuantity: 7,
      dimensions: '240x100x76 cm',
      weight: 72.0,
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: diningTablesCategory.id,
      images: {
        create: [
          {
            url: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4',
            altText: 'Aalborg Solid White Oak Dining Table',
            isPrimary: true,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  console.log('📦 Products seeded (Variable & Simple).');

  // 6. Blog Section
  const blogCategory = await prisma.blogCategory.create({
    data: {
      name: 'Woodcraft & Design Guides',
      slug: 'woodcraft-and-design-guides',
      description: 'Expert advice on woodworking, interior styling, and furniture longevity.',
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'The Art of Hardwood Joinery: Why Solid Oak & Walnut Endure for Decades',
      slug: 'the-art-of-hardwood-joinery-why-solid-oak-walnut-endure',
      excerpt:
        'Discover the difference between commercial veneer furniture and generational mortise-and-tenon craftsmanship.',
      content: `
# The Enduring Value of Hardwood Furniture

When investing in furniture for your home, understanding construction techniques transforms the way you view everyday pieces.

## 1. Kiln-Dried Hardwoods vs. Engineered Particle Boards
Kiln drying stabilizes the moisture content in natural timber to between 6% and 8%, preventing warping, bowing, or seasonal splitting when climate control conditions fluctuate in your home.

## 2. Mortise and Tenon Joinery
Traditional interlocking joinery disperses mechanical loads across interlocking wood fibers rather than relying solely on metallic fasteners or glue seams.

## 3. Natural Oil and Hardwax Finishes
Unlike polyurethane plastic coatings that flake or yellow over time, hardwax oils penetrate into the pores of oak and walnut, preserving tactile wood grains and allowing effortless spot repairs without strip-sanding the whole piece.
      `,
      featuredImage: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
      status: PostStatus.PUBLISHED,
      authorId: admin.id,
      categoryId: blogCategory.id,
      publishedAt: new Date(),
    },
  });

  console.log('✍️ Blog posts and categories seeded.');

  // 6. Media Library Assets
  await prisma.media.createMany({
    data: [
      {
        filename: 'furniture-armchair-living-room.jpg',
        originalName: 'nordic-minimalist-armchair.jpg',
        mimeType: 'image/jpeg',
        size: 348200,
        url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c',
        altText: 'Nordic minimalist lounge armchair in American walnut and velvet',
        caption: 'Nordic Minimalist Living Room Setup',
        width: 1920,
        height: 1280,
      },
      {
        filename: 'furniture-dining-table-oak.jpg',
        originalName: 'copenhagen-dining-table.jpg',
        mimeType: 'image/jpeg',
        size: 512400,
        url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200',
        altText: 'Copenhagen solid white oak extending dining table',
        caption: 'Dining Room Showcase Table',
        width: 2400,
        height: 1600,
      },
      {
        filename: 'furniture-wood-joinery-detail.jpg',
        originalName: 'artisan-wood-joinery.jpg',
        mimeType: 'image/jpeg',
        size: 289100,
        url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
        altText: 'Close up mortise and tenon joinery in solid walnut wood',
        caption: 'Handcrafted Joint Detail',
        width: 1800,
        height: 1200,
      },
      {
        filename: 'furniture-interior-showcase.jpg',
        originalName: 'living-room-interior-sofa.jpg',
        mimeType: 'image/jpeg',
        size: 620500,
        url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
        altText: 'Contemporary Scandinavian living room interior with green sofa',
        caption: 'Scandinavian Living Space',
        width: 2560,
        height: 1440,
      },
      {
        filename: 'furniture-walnut-credenza.jpg',
        originalName: 'walnut-sideboard-credenza.jpg',
        mimeType: 'image/jpeg',
        size: 441000,
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2',
        altText: 'Mid-century modern walnut credenza sideboard cabinet',
        caption: 'Storage & Credenza Detail',
        width: 2000,
        height: 1333,
      },
      {
        filename: 'furniture-fabric-swatch-linen.jpg',
        originalName: 'ivory-linen-texture.jpg',
        mimeType: 'image/jpeg',
        size: 195000,
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        altText: 'Tactile natural ivory linen upholstery swatch texture',
        caption: 'Ivory Linen Fabric Texture',
        width: 1600,
        height: 1600,
      },
    ],
  });

  console.log('🖼️ Media library assets seeded.');
  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
