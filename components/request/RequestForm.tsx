"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "lucide-react";
import { requestSchema, type RequestFormData } from "@/lib/validations/request.schema";
import { useAreas } from "@/hooks/useAreas";
import { AppleButton } from "@/components/ui/AppleButton";
import { AppleInput } from "@/components/ui/AppleInput";
import { AppleSegmented } from "@/components/ui/AppleSegmented";
import { AreaChip } from "@/components/ui/AreaChip";

const PROPERTY_TYPES = ["Villa", "Townhouse", "Apartment", "Penthouse"];
const BEDROOMS = ["Studio", "1", "2", "3", "4", "5", "6+"];

export function RequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const { data: areas = [] } = useAreas();

  const { control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: { intent: "buy", area_ids: [] },
  });

  const intent = watch("intent");
  const selectedAreas = watch("area_ids") ?? [];
  const selectedType = watch("property_type");
  const selectedBedrooms = watch("bedrooms");

  const toggleArea = (id: string) => {
    const next = selectedAreas.includes(id)
      ? selectedAreas.filter((a) => a !== id)
      : [...selectedAreas, id];
    setValue("area_ids", next, { shouldValidate: true });
  };

  const onSubmit = async (data: RequestFormData) => {
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <CheckCircleIcon size={64} className="text-apple-green" strokeWidth={1.5} />
        <h2 className="text-title1">Request Submitted</h2>
        <p className="text-body text-text-secondary max-w-xs">
          Property owners who match your criteria will reach out via WhatsApp.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      <Controller name="intent" control={control} render={({ field }) => (
        <AppleSegmented
          options={[{ value: "buy", label: "Buy" }, { value: "rent", label: "Rent" }]}
          value={field.value}
          onChange={field.onChange}
        />
      )} />

      <section>
        <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">Areas</p>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <AreaChip
              key={a.id}
              label={a.name}
              selected={selectedAreas.includes(a.id)}
              onClick={() => toggleArea(a.id)}
            />
          ))}
        </div>
        {errors.area_ids && <p className="mt-2 text-caption1 text-apple-red">{errors.area_ids.message}</p>}
      </section>

      <section>
        <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">Property type</p>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((t) => (
            <AreaChip key={t} label={t} selected={selectedType === t} onClick={() => setValue("property_type", t, { shouldValidate: true })} />
          ))}
        </div>
        {errors.property_type && <p className="mt-2 text-caption1 text-apple-red">{errors.property_type.message}</p>}
      </section>

      <section>
        <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOMS.map((b) => (
            <AreaChip key={b} label={b} selected={selectedBedrooms === b} onClick={() => setValue("bedrooms", b, { shouldValidate: true })} />
          ))}
        </div>
        {errors.bedrooms && <p className="mt-2 text-caption1 text-apple-red">{errors.bedrooms.message}</p>}
      </section>

      <section>
        <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">
          Budget ({intent === "buy" ? "sale price" : "annual rent"})
        </p>
        <div className="flex gap-3">
          <Controller name="budget_min" control={control} render={({ field }) => (
            <AppleInput
              label="Min AED"
              type="number"
              inputMode="numeric"
              className="flex-1"
              value={field.value?.toString() ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
            />
          )} />
          <Controller name="budget_max" control={control} render={({ field }) => (
            <AppleInput
              label="Max AED"
              type="number"
              inputMode="numeric"
              className="flex-1"
              value={field.value?.toString() ?? ""}
              onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
            />
          )} />
        </div>
      </section>

      <section>
        <p className="text-caption1 text-text-secondary uppercase tracking-widest mb-3">Your details</p>
        <div className="flex flex-col gap-3">
          <Controller name="requester_name" control={control} render={({ field }) => (
            <AppleInput label="Full name" {...field} error={errors.requester_name?.message} />
          )} />
          <Controller name="whatsapp" control={control} render={({ field }) => (
            <AppleInput label="WhatsApp" type="tel" inputMode="tel" prefix={<span className="text-text-secondary">+971</span>} {...field} error={errors.whatsapp?.message} />
          )} />
          <Controller name="notes" control={control} render={({ field }) => (
            <div className="relative">
              <textarea
                {...field}
                value={field.value ?? ""}
                rows={3}
                placeholder="Any specific requirements..."
                className="w-full px-4 py-3 rounded-md border border-[var(--separator-thick)] text-[17px] text-text-primary placeholder:text-text-tertiary bg-white resize-none focus:outline-none focus:border-apple-blue focus:shadow-[0_0_0_3.5px_rgba(0,113,227,0.15)] transition-all duration-fast"
              />
            </div>
          )} />
        </div>
      </section>

      <AppleButton type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
        Submit Request
      </AppleButton>
    </form>
  );
}
