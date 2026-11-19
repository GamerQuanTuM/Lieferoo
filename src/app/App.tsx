import { DataProvider } from "@/data/DataProvider";
import { DetailsScreen, SearchScreen } from "@/features/address";
import { CheckoutScreen, PlacedScreen } from "@/features/checkout";
import { RiderListScreen, RiderScreen } from "@/features/rider";
import { useHashRoute } from "./useHashRoute";

/** Route table: `#/` · `#/address/:id` · `#/checkout` · `#/placed/:token` · `#/rider` · `#/rider/:idOrToken` (see shared/routes). */
export function App() {
  const [page, param = ""] = useHashRoute();
  return (
    <DataProvider>
      {page === "address" ? <DetailsScreen addressId={param} />
        : page === "checkout" ? <CheckoutScreen />
        : page === "placed" ? <PlacedScreen token={param} />
        : page === "rider" ? (param ? <RiderScreen param={param} /> : <RiderListScreen />)
        : <SearchScreen />}
    </DataProvider>
  );
}
