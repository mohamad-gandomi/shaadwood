import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import slugify from 'slugify';
import { PrismaService } from '@/database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findTree() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            children: true,
            _count: { select: { products: true } },
          },
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async findAllFlat() {
    return this.prisma.category.findMany({
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true, children: true } },
      },
      orderBy: [{ parentId: 'asc' }, { displayOrder: 'asc' }],
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category '${slug}' not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    if (dto.parentId) {
      const parent = await this.prisma.category.findUnique({
        where: { id: dto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category with ID ${dto.parentId} does not exist`);
      }
    }

    return this.prisma.category.create({
      data: {
        ...dto,
        slug,
      },
      include: {
        parent: true,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    let slug = category.slug;
    if (dto.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
    } else if (dto.name && !dto.slug) {
      slug = slugify(dto.name, { lower: true, strict: true });
    }

    if (slug !== category.slug) {
      const existing = await this.prisma.category.findUnique({
        where: { slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data: {
        ...dto,
        slug,
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
