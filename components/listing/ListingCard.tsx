"use client";
import { MapPinIcon, ShieldCheckIcon } from "lucide-react";
import { AppleBadge } from "@/components/ui/AppleBadge";
import { formatPrice, formatDate, whatsAppLink } from "@/lib/utils/format";
import type { ListingWithLocation } from "@/types";

interface Props {
  listing: ListingWithLocation;
}

export function ListingCard({ listing }: Props) {
  const waMessage = `Hi, I saw your ${listing.bedrooms}BR ${listing.property_type} listing in ${listing.sub_area?.name ?? listing.area?.name} on Zaylo. I'm interested.`;

  return (
    <div className="bg-white border border-[var(--separator)] rounded-xl shadow-card overflow-hidden stagger-children">
      <div className="p-4">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listing.list_for_sale && <AppleBadge variant="green">For Sale</AppleBadge>}
          {listing.list_for_rent && <AppleBadge variant="blue">For Rent</AppleBadge>}
          {listing.vacant && <AppleBadge variant="grey">Vacant</AppleBadge>}
          {listing.verified && (
            <AppleBadge variant="green">
              <ShieldCheckIcon size={11} aria-hidden />
              Verified
            </AppleBadge>
          )}
        </div>

        {/* Title */}
        <h3 className="text-headline mb-1">
          {listing.bedrooms === "Studio" ? "Studio" : `${listing.bedrooms}BR`}{" "}
          {listing.property_type}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-footnote text-text-secondary mb-3">
          <MapPinIcon size={12} aria-hidden />
          <span>
            {listing.sub_area?.name
              ? `${listing.sub_area.name}, ${listing.area?.name}`
              : listing.area?.name}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          {listing.list_for_sale && listing.sale_price && (
            <p className="text-title2 tabular-nums">{formatPrice(listing.sale_price)}</p>
          )}
          {listing.list_for_rent && listing.rent_price && (
            <p className={listing.list_for_sale ? "text-subhead text-text-secondary tabular-nums" : "text-title2 tabular-nums"}>
              {formatPrice(listing.rent_price)}
              <span className="text-footnote text-text-secondary font-normal">/yr</span>
            </p>
          )}
        </div>

        {/* CTA */}
        <a
          href={whatsAppLink(listing.whatsapp, waMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full h-[44px] rounded-pill bg-whatsapp text-white text-subhead font-semibold transition-all duration-fast ease-apple hover:brightness-95 active:scale-97"
        >
          <WhatsAppIcon />
          Contact Owner
        </a>
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[var(--separator)] flex justify-between items-center">
        <span className="text-caption1 text-text-tertiary">{listing.owner_name}</span>
        <span className="text-caption1 text-text-tertiary">
          {listing.created_at ? formatDate(listing.created_at) : ""}
        </span>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
