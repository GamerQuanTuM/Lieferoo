/** Public API of the address feature. Other features import ONLY from here. */
export { SearchScreen } from "./SearchScreen";
export { DetailsScreen } from "./DetailsScreen";
export { getAddress, searchAddresses, addressLineEn, checkBuildingNumber, toDeliveryAddress } from "./addresses";
export { loadDraft, saveDraft, type Draft } from "./draft";
