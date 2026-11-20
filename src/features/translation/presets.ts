import type { RiderPreset, StorePreset } from "@/domain/types";

/** Labels exactly as in B3_data_spec.md §3. */
export const PRESET_LABEL_EN: Record<RiderPreset, string> = {
  LEAVE_AT_DOOR_NO_RING: "Leave at door, don't ring",
  LEAVE_AT_DOOR_RING: "Leave at door, ring bell",
  HAND_TO_ME: "Hand it to me",
  CALL_ON_ARRIVAL: "Call me when you arrive",
};

export const PRESET_LABEL_KO: Record<RiderPreset, string> = {
  LEAVE_AT_DOOR_NO_RING: "문 앞에 두고 벨은 누르지 말아주세요",
  LEAVE_AT_DOOR_RING: "문 앞에 두고 벨 눌러주세요",
  HAND_TO_ME: "직접 받을게요",
  CALL_ON_ARRIVAL: "도착하면 전화주세요",
};

/** Order shown in the customer app (as-is screen 03). */
export const PRESETS: RiderPreset[] = [
  "LEAVE_AT_DOOR_NO_RING",
  "LEAVE_AT_DOOR_RING",
  "HAND_TO_ME",
  "CALL_ON_ARRIVAL",
];

/**
 * Quick requests to the store — fixed Korean labels, so the shop always reads them correctly
 * (pre-set options are safer than free text, like a kiosk). Only "Not spicy" is confirmed so far;
 * add the rest here when the designer sends the list.
 */
export const STORE_PRESET_LABEL_EN: Record<StorePreset, string> = {
  NOT_SPICY: "Not spicy",
};

export const STORE_PRESET_LABEL_KO: Record<StorePreset, string> = {
  NOT_SPICY: "맵지 않음",
};

/** Order shown on checkout. */
export const STORE_PRESETS: StorePreset[] = ["NOT_SPICY"];
