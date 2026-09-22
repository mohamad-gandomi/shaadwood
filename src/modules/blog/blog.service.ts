import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import slugify from 'slugify';
import { Prisma, PostStatus } from '@prisma/client';
import { PrismaService } from '@/database/prisma.service';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/create-blog-post.dto';
import { CreateBlogCategoryDto } from './dto/create-blog-category.dto';
import { FilterBlogPostsDto } from './dto/filter-blog-posts.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // --- Categories ---

  async findAllCategories() {
    return this.prisma.blogCategory.findMany({
      include: {
        _count: { select: { posts: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async createCategory(dto: CreateBlogCategoryDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.name, { lower: true, strict: true });

    const existing = await this.prisma.blogCategory.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    return this.prisma.blogCategory.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
      },
    });
  }

  // --- Posts ---

  async findAllPosts(filters: FilterBlogPostsDto) {
    const { skip, limit, search, categorySlug, status } = filters;

    const where: Prisma.BlogPostWhereInput = {};

    if (status) {
      where.status = status;
    } else {
      where.status = PostStatus.PUBLISHED;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, firstName: true, lastName: true } },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page: filters.page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPostBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Blog post '${slug}' not found`);
    }

    return post;
  }

  async createPost(authorId: string, dto: CreateBlogPostDto) {
    const slug = dto.slug
      ? slugify(dto.slug, { lower: true, strict: true })
      : slugify(dto.title, { lower: true, strict: true });

    const existing = await this.prisma.blogPost.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`Blog post with slug '${slug}' already exists`);
    }

    return this.prisma.blogPost.create({
      data: {
        ...dto,
        slug,
        authorId,
        publishedAt: dto.status === PostStatus.PUBLISHED ? new Date() : null,
      },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async updatePost(id: string, dto: UpdateBlogPostDto) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    let slug = existing.slug;
    if (dto.slug) {
      slug = slugify(dto.slug, { lower: true, strict: true });
    } else if (dto.title && !dto.slug) {
      slug = slugify(dto.title, { lower: true, strict: true });
    }

    if (slug !== existing.slug) {
      const conflict = await this.prisma.blogPost.findUnique({ where: { slug } });
      if (conflict && conflict.id !== id) {
        throw new ConflictException(`Blog post with slug '${slug}' already exists`);
      }
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...dto,
        slug,
        ...(dto.status === PostStatus.PUBLISHED && !existing.publishedAt && {
          publishedAt: new Date(),
        }),
      },
      include: {
        category: true,
        author: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async deletePost(id: string) {
    const existing = await this.prisma.blogPost.findUnique({
      where: { id },
    });
    if (!existing) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    return this.prisma.blogPost.delete({
      where: { id },
    });
  }
}
