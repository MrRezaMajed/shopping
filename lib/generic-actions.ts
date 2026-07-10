"use server";

import { createItem } from "./crud";
import { modelConfig, ModelKey } from "./model-config";
import { saveFile, saveMultipleFiles } from "./file-service";

export async function createGeneric(
  model: ModelKey,
  formData: FormData
) {
  try {
    const config = modelConfig[model];
    const data: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      const fileField = config?.fileFields?.[key];

      // اگر فیلد فایل است
      if (fileField) {
        if (fileField.multiple) {
          const files = formData.getAll(key) as File[];
          const paths = await saveMultipleFiles(files);
          data[key] = paths;
        } else {
          const file = value as File;

          if (file.size === 0 && fileField.required) {
            throw new Error(`${key} is required`);
          }

          if (file.size > 0) {
            const path = await saveFile(file);
            data[key] = path;
          }
        }
      } else {
        data[key] = value;
      }
    }

    return await createItem(model, data);
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
}
