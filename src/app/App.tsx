import { DataProvider } from "@/data/DataProvider";
import { DetailsScreen, PinScreen, SearchScreen } from "@/features/address";
import { CheckoutScreen, PlacedScreen, TrackingScreen } from "@/features/checkout";
import { RiderListScreen, RiderScreen } from "@/features/rider";
import { StoreOrderScreen } from "@/features/store";
import { useHashRoute } from "./useHashRoute";

/** Route table: `#/` · `#/address/:id` · `#/checkout` · `#/placed/:token` · `#/pin` · `#/track/:token` · `#/store/:idOrToken` · `#/rider` · `#/rider/:idOrToken` (see shared/routes). */
export function App() {
  const [page, param = ""] = useHashRoute();
  return (
    <DataProvider>
      {page === "address" ? <DetailsScreen addressId={param} />
        : page === "pin" ? <PinScreen />
        : page === "track" ? <TrackingScreen token={param} />
        : page === "store" ? <StoreOrderScreen param={param} />
        : page === "checkout" ? <CheckoutScreen />
        : page === "placed" ? <PlacedScreen token={param} />
        : page === "rider" ? (param ? <RiderScreen param={param} /> : <RiderListScreen />)
        : <SearchScreen />}
    </DataProvider>
  );
}
