'use server'

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Unexpected error'

export async function createUser(formData: FormData) {
  try {
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null

    if (!email) {
      return { error: 'Email is required' }
    }

    const user = await prisma.user.create({
      data: {
        name: name || null,
        email,
      },
      include: {
        posts: true,
      },
    })

    revalidatePath('/')
    return { success: true, user }
  } catch (error) {
    console.error('Error creating user:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Email already registered' }
    }
    return { error: getErrorMessage(error) }
  }
}

export async function updateUser(id: number, formData: FormData) {
  try {
    const name = formData.get('name') as string | null
    const email = formData.get('email') as string | null

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      include: {
        posts: true,
      },
    })

    revalidatePath('/')
    return { success: true, user }
  } catch (error) {
    console.error('Error updating user:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { error: 'Email already registered' }
    }
    return { error: getErrorMessage(error) }
  }
}

export async function deleteUser(id: number) {
  try {
    await prisma.post.deleteMany({
      where: { authorId: id },
    })

    await prisma.user.delete({
      where: { id },
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting user:', error)
    return { error: getErrorMessage(error) }
  }
}
