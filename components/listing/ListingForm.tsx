"use client";
import { useState, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon, UploadCloudIcon, CheckCircleIcon } from "lucide-react";
import { listingSchema, type ListingFormData } from "@/lib/validations/listing.schema";
import { useAreas } from "@/hooks/useAreas";
import { AppleButton } from "@/components/ui/AppleButton";
import { AppleInput } from "@/components/ui/AppleInput";
import { AppleToggle } from "@/components/ui/AppleToggle";
import { AppleStepper } from "@/components/ui/AppleStepper";
import { AreaChip } from "@/components/ui/AreaChip";
import { formatPrice } from "@/lib/utils/format";

const STEPS = ["Property", "Pricing", "Contact", "Verify"];
const PROPERTY_TYPES = ["Villa", "Townhouse", "Apartment", "Penthouse"] as const;
const BEDROOMS = ["Studio", "1", "2", "3", "4", "5", "6+"];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit:  (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

interface Props {
  onComplete?: (id: string, reference: string) => void;
}

export function ListingForm({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ id: string; reference: string } | null>(null);

  const { data: areas = [] } = useAreas();

  const { control, watch, handleSubmit, setValue, formState: { errors }, trigger } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: { vacant: true, list_for_sale: false, list_for_rent: false },
  });

  const selectedAreaId = watch("area_id");
  const subAreas = areas.find((a) => a.id === selectedAreaId)?.sub_areas ?? [];
  const listForSale = watch("list_for_sale");
  const listForRent = watch("list_for_rent");
  const formValues = watch();

  const goNext = useCallback(async () => {
    const fields: (keyof ListingFormData)[][] = [
      ["area_id", "property_type", "bedrooms"],
      ["list_for_sale", "list_for_rent"],
      ["owner_name", "whatsapp"],
      [],
    ];
    const valid = await trigger(fields[step] as (keyof ListingFormData)[]);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }, [step, trigger]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const { signedUrl, publicUrl } = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, contentType: file.type }),
      }).then((r) => r.json());

      await fetch(signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      setUploadedName(file.name);
      setValue("title_deed_url", publicUrl);
    } catch {}
    setUploading(false);
  }, [setValue]);

  const onSubmit = useCallback(async (data: ListingFormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok) {
        setSubmitted({ id: json.id, reference: json.reference });
        onComplete?.(json.id, json.reference);
      }
    } catch {}
    setSubmitting(false);
  }, [onComplete]);

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <CheckCircleIcon size={64} className="text-apple-green" strokeWidth={1.5} />
        <div>
          <h2 className="text-title1 mb-2">Listing Submitted</h2>
          <p className="text-body text-text-secondary max-w-xs">
            We&apos;ll verify your title deed and activate your listing within 24 hours.
          </p>
        </div>
        <div className="bg-bg-secondary rounded-lg px-5 py-3">
          <p className="text-caption1 text-text-secondary mb-0.5">Reference</p>
          <p className="font-mono text-headline text-apple-blue">{submitted.reference}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        {step > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="text-apple-blue text-callout flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <ArrowLeftIcon size={16} aria-hidden />
            Back
          </button>
        )}
        <AppleStepper steps={STEPS} currentStep={step} />
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {step === 0 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-title2 mb-4">What type of property?</h2>
                <div className="flex flex-wrap gap-2">
                  <Controller name="property_type" control={control} render={({ field }) =>
                    <>{PROPERTY_TYPES.map((t) => (
                      <AreaChip key={t} label={t} selected={field.value === t} onClick={() => field.onChange(t)} />
                    ))}</>
                  } />
                </div>
                {errors.property_type && <p className="mt-2 text-caption1 text-apple-red">{errors.property_type.message}</p>}
              </div>

              <div>
                <p className="text-headline mb-3">Bedrooms</p>
                <div className="flex flex-wrap gap-2">
                  <Controller name="bedrooms" control={control} render={({ field }) =>
                    <>{BEDROOMS.map((b) => (
                      <AreaChip key={b} label={b} selected={field.value === b} onClick={() => field.onChange(b)} />
                    ))}</>
                  } />
                </div>
                {errors.bedrooms && <p className="mt-2 text-caption1 text-apple-red">{errors.bedrooms.message}</p>}
              </div>

              <div>
                <p className="text-headline mb-3">Area</p>
                <Controller name="area_id" control={control} render={({ field }) => (
                  <select
                    {...field}
                    className="w-full h-[52px] px-4 rounded-md border border-[var(--separator-thick)] text-[17px] text-text-primary bg-white focus:outline-none focus:border-apple-blue focus:shadow-[0_0_0_3.5px_rgba(0,113,227,0.15)]"
                    onChange={(e) => { field.onChange(e); setValue("sub_area_id", undefined as unknown as string); }}
                  >
                    <option value="">Select area</option>
                    {areas.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                )} />
                {errors.area_id && <p className="mt-2 text-caption1 text-apple-red">{errors.area_id.message}</p>}
              </div>

              {subAreas.length > 0 && (
                <div>
                  <p className="text-headline mb-3">Sub-area</p>
                  <Controller name="sub_area_id" control={control} render={({ field }) => (
                    <select
                      {...field}
                      className="w-full h-[52px] px-4 rounded-md border border-[var(--separator-thick)] text-[17px] text-text-primary bg-white focus:outline-none focus:border-apple-blue"
                    >
                      <option value="">Select sub-area</option>
                      {subAreas.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  )} />
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-title2">Pricing & Availability</h2>

              <div className="flex items-center justify-between py-3 border-b border-[var(--separator)]">
                <span className="text-body">Currently vacant</span>
                <Controller name="vacant" control={control} render={({ field }) =>
                  <AppleToggle checked={field.value} onChange={field.onChange} />
                } />
              </div>

              <div className="border border-[var(--separator)] rounded-xl overflow-hidden">
                <Controller name="list_for_sale" control={control} render={({ field }) => (
                  <label className="flex items-center gap-3 p-4 cursor-pointer">
                    <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-[18px] h-[18px] accent-apple-blue" />
                    <span className="text-body flex-1">Selling</span>
                  </label>
                )} />
                {listForSale && (
                  <div className="px-4 pb-4">
                    <Controller name="sale_price" control={control} render={({ field }) => (
                      <AppleInput
                        label="Sale price"
                        prefix={<span className="text-text-secondary">AED</span>}
                        type="number"
                        min="0"
                        value={field.value?.toString() ?? ""}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        error={errors.sale_price?.message}
                      />
                    )} />
                  </div>
                )}

                <div className="border-t border-[var(--separator)]">
                  <Controller name="list_for_rent" control={control} render={({ field }) => (
                    <label className="flex items-center gap-3 p-4 cursor-pointer">
                      <input type="checkbox" checked={field.value} onChange={(e) => field.onChange(e.target.checked)} className="w-[18px] h-[18px] accent-apple-blue" />
                      <span className="text-body flex-1">Renting</span>
                    </label>
                  )} />
                  {listForRent && (
                    <div className="px-4 pb-4">
                      <Controller name="rent_price" control={control} render={({ field }) => (
                        <AppleInput
                          label="Annual rent"
                          prefix={<span className="text-text-secondary">AED</span>}
                          suffix={<span className="text-text-tertiary text-footnote">/yr</span>}
                          type="number"
                          min="0"
                          value={field.value?.toString() ?? ""}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                          error={errors.rent_price?.message}
                        />
                      )} />
                    </div>
                  )}
                </div>
              </div>
              {errors.list_for_sale && <p className="text-caption1 text-apple-red">{errors.list_for_sale.message}</p>}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-title2">How can buyers reach you?</h2>
              <Controller name="owner_name" control={control} render={({ field }) => (
                <AppleInput label="Full name" {...field} error={errors.owner_name?.message} />
              )} />
              <Controller name="whatsapp" control={control} render={({ field }) => (
                <AppleInput
                  label="WhatsApp number"
                  type="tel"
                  inputMode="tel"
                  prefix={<span className="text-text-secondary">+971</span>}
                  {...field}
                  error={errors.whatsapp?.message}
                />
              )} />
              <p className="text-footnote text-text-secondary text-center">
                Buyers and tenants will contact you directly.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-title2">Upload your title deed</h2>

              <label className={[
                "flex flex-col items-center justify-center gap-3 p-8",
                "border-2 border-dashed border-[rgba(0,0,0,0.15)] rounded-xl cursor-pointer",
                "transition-colors hover:border-apple-blue hover:bg-[rgba(0,113,227,0.02)]",
              ].join(" ")}>
                {uploading ? (
                  <div className="animate-spin"><UploadCloudIcon size={36} className="text-apple-blue" /></div>
                ) : uploadedName ? (
                  <>
                    <CheckCircleIcon size={36} className="text-apple-green" />
                    <span className="text-footnote text-text-secondary">{uploadedName}</span>
                  </>
                ) : (
                  <>
                    <UploadCloudIcon size={36} className="text-text-tertiary" strokeWidth={1.5} />
                    <div className="text-center">
                      <p className="text-subhead">Tap to upload</p>
                      <p className="text-caption1 text-text-tertiary">PDF, JPG, PNG · max 10MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f && f.size <= 10 * 1024 * 1024) handleUpload(f); }}
                />
              </label>

              {/* Summary */}
              <div className="border border-[var(--separator)] rounded-xl overflow-hidden">
                <p className="px-4 py-2.5 text-caption1 text-text-secondary font-medium uppercase tracking-widest border-b border-[var(--separator)]">
                  Summary
                </p>
                {[
                  ["Property", `${formValues.bedrooms === "Studio" ? "Studio" : `${formValues.bedrooms}BR`} ${formValues.property_type}`],
                  ["Location", areas.find((a) => a.id === formValues.area_id)?.sub_areas.find((s) => s.id === formValues.sub_area_id)?.name
                    ? `${areas.find((a) => a.id === formValues.area_id)?.sub_areas.find((s) => s.id === formValues.sub_area_id)?.name}, ${areas.find((a) => a.id === formValues.area_id)?.name}`
                    : areas.find((a) => a.id === formValues.area_id)?.name ?? "—"],
                  formValues.list_for_sale && formValues.sale_price ? ["Sale Price", formatPrice(formValues.sale_price)] : null,
                  formValues.list_for_rent && formValues.rent_price ? ["Rent", `${formatPrice(formValues.rent_price)}/yr`] : null,
                  ["Vacant", formValues.vacant ? "Yes" : "No"],
                  ["WhatsApp", formValues.whatsapp ?? "—"],
                ].filter((x): x is [string, string] => Boolean(x)).map(([k, v]) => (
                  <div key={k} className="flex justify-between px-4 py-3 border-b border-[var(--separator)] last:border-0">
                    <span className="text-subhead text-text-secondary">{k}</span>
                    <span className="text-subhead text-text-primary font-medium">{v}</span>
                  </div>
                ))}
              </div>

              <p className="text-caption1 text-text-tertiary text-center">
                Your title deed is only used for verification and never shared.
              </p>

              <AppleButton
                variant="primary"
                size="lg"
                fullWidth
                loading={submitting}
                onClick={handleSubmit(onSubmit)}
              >
                Submit Listing
              </AppleButton>
              <p className="text-caption1 text-text-secondary text-center">
                We&apos;ll verify within 24 hours.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step < 3 && (
        <div className="mt-8">
          <AppleButton variant="primary" size="lg" fullWidth onClick={goNext}>
            Continue
          </AppleButton>
        </div>
      )}
    </div>
  );
}
