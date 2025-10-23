"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { buildSchemaFromConfig } from "@/lib/activity/build-schema";
import { ActivityTypes } from "@/constants/index";
import { ActivityLayouts } from "@/lib/activity/activity-layouts";

export default function ActivityForm({ activityKey }) {
  const tool = ActivityTypes[activityKey];
  const layout = ActivityLayouts[activityKey];
  const schema = buildSchemaFromConfig(tool.config);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(
      tool.config.fields.map(f => [f.name, f.defaultValue ?? ""])
    ),
  });

  const onSubmit = (data) => console.log("✅ Form submitted:", data);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {layout.layout.map((row, i) => (
        <div
          key={i}
          className={
            row.type === "grid"
              ? `grid grid-cols-${row.columns} gap-4`
              : "flex flex-col gap-4"
          }
        >
          {row.fields.map((fieldName) => {
            const field = tool.config.fields.find(f => f.name === fieldName);
            if (!field) return null;

            switch (field.type) {
              case "textarea":
                return (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <textarea {...form.register(field.name)} placeholder={field.placeholder} />
                  </div>
                );

              case "select":
                return (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <select {...form.register(field.name)}>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                );

              case "slider":
                return (
                  <div key={field.name}>
                    <label>{field.label}</label>
                    <input type="range" min={field.min} max={field.max} step={field.step} {...form.register(field.name)} />
                  </div>
                );

              case "checkbox":
                return (
                  <div key={field.name} className="flex items-center gap-2">
                    <input type="checkbox" {...form.register(field.name)} />
                    <label>{field.label}</label>
                  </div>
                );

              default:
                return (
                  <input
                    key={field.name}
                    {...form.register(field.name)}
                    placeholder={field.placeholder}
                    className="border rounded px-2 py-1"
                  />
                );
            }
          })}
        </div>
      ))}

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Submit
      </button>
    </form>
  );
}
