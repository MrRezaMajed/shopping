'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  try {
    const title = formData.get('title') as string | null
    const content = formData.get('content') as string | null
    const authorId = formData.get('authorId') as string | null
    const published = formData.get('published') === 'true'

    if (!title || !authorId || Number.isNaN(parseInt(authorId))) {
      return { error: 'Title and author are required' }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content: content || '',
        published,
        authorId: parseInt(authorId),
      },
      include: {
        author: true,
      },
    })

    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    console.error('Error creating post:', error)
    return { error: error instanceof Error ? error.message : 'Error creating post' }
  }
}

export async function updatePost(id: number, formData: FormData) {
  try {
    const title = formData.get('title') as string | null
    const content = formData.get('content') as string | null
    const published = formData.get('published') === 'true'

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(content !== null && { content }),
        published,
      },
      include: {
        author: true,
      },
    })

    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    console.error('Error updating post:', error)
    return { error: error instanceof Error ? error.message : 'Error updating post' }
  }
}

export async function deletePost(id: number) {
  try {
    await prisma.post.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting post:', error)
    return { error: error instanceof Error ? error.message : 'Error deleting post' }
  }
}

export async function togglePostPublished(id: number, published: boolean) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published },
      include: {
        author: true,
      },
    })

    revalidatePath('/')
    return { success: true, post }
  } catch (error) {
    console.error('Error toggling post:', error)
    return { error: error instanceof Error ? error.message : 'Error toggling post state' }
  }
}
