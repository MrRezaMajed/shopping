// @/app/actions/postCommentsClient.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface SubmitCommentInput {
  postId: number;
  userId?: number | null; // شناسه کاربر لاگین کرده در سایت اصلی
  text: string;
  parentId?: number | null; // 👈 جهت پیوند دادن سوالات بعدی کاربر به گفتگوی قبلی
}

export async function submitPostComment({ postId, userId, text, parentId }: SubmitCommentInput) {
  try {
    if (!text.trim()) {
      throw new Error("متن دیدگاه نمی‌تواند خالی باشد.");
    }

    const comment = await prisma.postComment.create({
      data: {
        postId,
        userId: userId || null,
        parentId: parentId || null, // 👈 پیوند دادن خودکار به نظر اصلی
        text,
        status: "PENDING", // نظرات جدید به طور پیش‌فرض معلق ثبت می‌شوند
      },
    });

    revalidatePath(`/blog/${postId}`); 

    return { success: true, data: comment };
  } catch (err: any) {
    console.error("submitPostComment error:", err);
    return { success: false, error: err.message };
  }
}