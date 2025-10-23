import { z } from "zod";

export function buildSchemaFromConfig(config: any) {
  const shape: Record<string, any> = {};

  for (const field of config.fields) {
    let validator;

    switch (field.type) {
      case "textarea":
      case "input":
        validator = z.string();
        if (field.validation?.required) validator = validator.min(1, `${field.label} is required`);
        if (field.validation?.minLength) validator = validator.min(field.validation.minLength);
        if (field.validation?.maxLength) validator = validator.max(field.validation.maxLength);
        break;

      case "select":
        validator = z.enum(field.options as [string, ...string[]]);
        break;

      case "slider":
        validator = z.number();
        if (field.validation?.required) validator = validator.refine((v) => v !== undefined, "Required");
        break;

      case "checkbox":
        validator = z.boolean();
        break;

      default:
        validator = z.any();
    }

    shape[field.name] = validator;
  }

  return z.object(shape);
}
