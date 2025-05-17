"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";

const newsSchema = z.object({
  title: z.string().min(5, "Минимум 5 символов"),
  summary: z.string().min(10, "Минимум 10 символов"),
  content: z.string().min(20, "Минимум 20 символов"),
  mainImage: z.string().url("Укажите ссылку на изображение или загрузите файл"),
  images: z.array(z.string().url()).optional(),
});

type NewsFormValues = z.infer<typeof newsSchema>;

interface NewsFormProps {
  initialValues?: Partial<NewsFormValues>;
  onSubmit: (
    values: NewsFormValues,
    mainImageFile?: File,
    contentImages?: File[]
  ) => Promise<void>;
  loading?: boolean;
  submitText?: string;
}

export function NewsForm({
  initialValues = {},
  onSubmit,
  loading,
  submitText = "Сохранить",
}: NewsFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<NewsFormValues>({
    resolver: zodResolver(newsSchema),
    defaultValues: initialValues,
  });

  const uploadImage = useAction(api.news.uploadImage);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [contentImages, setContentImages] = useState<File[]>([]);
  const [contentImagePreviews, setContentImagePreviews] = useState<string[]>(
    initialValues.images || []
  );
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingContentIdx, setUploadingContentIdx] = useState<number | null>(
    null
  );
  const mainImage = watch("mainImage");
  const content = watch("content");
  const [mainImageError, setMainImageError] = useState<string | null>(null);
  const [contentImageError, setContentImageError] = useState<string | null>(
    null
  );

  // Drag&Drop для главного изображения
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMainImageError(null);
    const f = e.dataTransfer.files[0];
    if (f && f.type.startsWith("image/")) {
      setUploadingMain(true);
      try {
        const url = await uploadFileToConvex(f);
        if (!url) throw new Error("Ошибка загрузки изображения");
        setMainImageFile(f);
        setValue("mainImage", url, { shouldValidate: true });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMainImageError(err.message);
        } else {
          setMainImageError("Ошибка загрузки изображения");
        }
      } finally {
        setUploadingMain(false);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMainImageError(null);
    const f = e.target.files?.[0];
    if (f && f.type.startsWith("image/")) {
      setUploadingMain(true);
      try {
        const url = await uploadFileToConvex(f);
        if (!url) throw new Error("Ошибка загрузки изображения");
        setMainImageFile(f);
        setValue("mainImage", url, { shouldValidate: true });
      } catch (err: unknown) {
        if (err instanceof Error) {
          setMainImageError(err.message);
        } else {
          setMainImageError("Ошибка загрузки изображения");
        }
      } finally {
        setUploadingMain(false);
      }
    }
  };

  // Drag&Drop для изображений в тексте
  const handleContentImageDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setContentImageError(null);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    for (const f of files) {
      setUploadingContentIdx(contentImagePreviews.length);
      try {
        const url = await uploadFileToConvex(f);
        if (!url) throw new Error("Ошибка загрузки изображения");
        setContentImages((prev) => [...prev, f]);
        setContentImagePreviews((prev) => [...prev, url]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setContentImageError(err.message);
        } else {
          setContentImageError("Ошибка загрузки изображения");
        }
      } finally {
        setUploadingContentIdx(null);
      }
    }
  };

  const handleContentImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContentImageError(null);
    const files = Array.from(e.target.files || []).filter((f) =>
      f.type.startsWith("image/")
    );
    for (const f of files) {
      setUploadingContentIdx(contentImagePreviews.length);
      try {
        const url = await uploadFileToConvex(f);
        if (!url) throw new Error("Ошибка загрузки изображения");
        setContentImages((prev) => [...prev, f]);
        setContentImagePreviews((prev) => [...prev, url]);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setContentImageError(err.message);
        } else {
          setContentImageError("Ошибка загрузки изображения");
        }
      } finally {
        setUploadingContentIdx(null);
      }
    }
  };

  // Вставка изображения в текст (вставляет тег <img src=... /> в текущую позицию)
  const insertImageToContent = (url: string) => {
    const textarea = document.getElementById(
      "content-textarea"
    ) as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.slice(0, start);
    const after = content.slice(end);
    const newContent = `${before}<img src=\"${url}\" alt=\"Изображение\" class=\"my-4 rounded\" />${after}`;
    setValue("content", newContent, { shouldValidate: true });
  };

  // Удаление изображения из списка
  const removeContentImage = (idx: number) => {
    setContentImages((prev) => prev.filter((_, i) => i !== idx));
    setContentImagePreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // Функция загрузки файла в Convex Storage
  async function uploadFileToConvex(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const url = await uploadImage({
      file: JSON.stringify(Array.from(uint8Array)),
      contentType: file.type,
    });
    return url || "";
  }

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit(
          { ...v, images: contentImagePreviews },
          mainImageFile || undefined,
          contentImages
        )
      )}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title">Заголовок</Label>
        <Input id="title" {...register("title")} />
        {errors.title && (
          <div className="text-destructive text-xs mt-1">
            {errors.title.message}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="summary">Краткое описание</Label>
        <Textarea id="summary" {...register("summary")} rows={2} />
        {errors.summary && (
          <div className="text-destructive text-xs mt-1">
            {errors.summary.message}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="content">Текст новости</Label>
        <Textarea id="content-textarea" {...register("content")} rows={8} />
        {errors.content && (
          <div className="text-destructive text-xs mt-1">
            {errors.content.message}
          </div>
        )}
        {contentImageError && (
          <div className="text-destructive text-xs mt-1">
            {contentImageError}
          </div>
        )}
        <div className="mt-2">
          <div
            className="border border-dashed rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer bg-muted/40 hover:bg-muted/60 transition mb-2"
            onDrop={handleContentImageDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <span className="text-muted-foreground">
              Перетащите изображения для вставки в текст или выберите файлы
            </span>
            <Input
              type="file"
              accept="image/*"
              multiple
              className="mt-2"
              onChange={handleContentImageChange}
            />
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {contentImagePreviews.map((url, idx) => (
              <div key={url} className="relative group">
                <Image
                  src={url}
                  alt="Вставка"
                  width={80}
                  height={80}
                  className="rounded object-cover"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-6 h-6 opacity-80 group-hover:opacity-100"
                  onClick={() => removeContentImage(idx)}
                >
                  ×
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="mt-1 w-full"
                  onClick={() => insertImageToContent(url)}
                >
                  Вставить в текст
                </Button>
                {uploadingContentIdx === idx && (
                  <span className="text-xs text-muted-foreground block mt-1">
                    Загрузка...
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <Label>Главное изображение</Label>
        <div
          className="border border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer bg-muted/40 hover:bg-muted/60 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {mainImage ? (
            <Image
              src={mainImage}
              alt="Превью"
              width={320}
              height={180}
              className="rounded mb-2 object-cover max-h-40"
            />
          ) : (
            <span className="text-muted-foreground">
              Перетащите изображение или выберите файл
            </span>
          )}
          <Input
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleFileChange}
          />
          {uploadingMain && (
            <span className="text-xs text-muted-foreground block mt-1">
              Загрузка...
            </span>
          )}
          {mainImageError && (
            <div className="text-destructive text-xs mt-1">
              {mainImageError}
            </div>
          )}
        </div>
        {errors.mainImage && (
          <div className="text-destructive text-xs mt-1">
            {errors.mainImage.message}
          </div>
        )}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Сохранение..." : submitText}
      </Button>
    </form>
  );
}
