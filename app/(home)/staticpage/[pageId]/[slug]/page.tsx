// app/(home)/staticpage/[pageId]/[slug]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation"; // 👈 اضافه شدن redirect

interface Props {
  params: Promise<{
    pageId: string; 
    slug: string;   
  }>;
}

export default async function DynamicPage({ params }: Props) {
  const { pageId, slug } = await params;

  const numericId = Number(pageId.replace("page-", ""));
  if (isNaN(numericId)) notFound();

  const page = await prisma.page.findUnique({
    where: { id: numericId },
  });

  if (!page || page.status !== "ACTIVE" || page.softDeletedAt) {
    notFound();
  }

  // 👈👈 بررسی اسلاگ: اگر اسلاگ آدرس با اسلاگ واقعی برگه یکی نبود، ریدایرکت کن به آدرس درست!
  const decodedSlug = decodeURIComponent(slug);
  const correctSlug = page.slug || page.title;

  if (decodedSlug !== correctSlug) {
    redirect(`/staticpage/${pageId}/${encodeURIComponent(correctSlug)}`);
  }

  return (
    <article className="mr-8 mb-8" dir="rtl">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8 border-b pb-4">
        {page.title}
      </h1>

      {page.content ? (
        <div 
          className="prose dark:prose-invert max-w-none leading-relaxed text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="text-slate-400 text-sm font-medium py-4">
          محتوایی برای این برگه ثبت نشده است.
        </p>
      )}
    </article>
  );
}