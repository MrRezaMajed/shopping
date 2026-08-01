'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logActivity } from "./audit/log";
import { UserRole } from "@prisma/client";

/**
 * به‌روزرسانی نقش و دسترسی‌های یک کاربر
 */
export async function updateUserRoleAndPermissions(
  userId: number,
  role: UserRole,
  permissions: string[]
) {
  try {
    const permissionsString = permissions.join(",");

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        permissions: permissionsString,
      },
    });

    await logActivity({
      action: "UPDATE",
      modelName: "User",
      recordId: userId,
      targetName: updatedUser.name || updatedUser.email || `شناسه ${userId}`,
      details: `نقش کاربر به ${role} و دسترسی‌های جدید اعمال شد.`,
    });

    revalidatePath("/panel/users");
    return { success: true };
  } catch (error: any) {
    console.error("Error in updateUserRoleAndPermissions:", error);
    return { success: false, error: error.message };
  }
}