import { FilterControl } from "@components/generic/Filter/FilterControl.tsx";
import {
  type FilterState,
  useFilterNode,
} from "@components/generic/Filter/useFilterNode.ts";
import { BaseMap } from "@components/Map.tsx";
import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { cn } from "@core/utils/cn.ts";
import type { Protobuf } from "@meshtastic/core";
import { bbox, lineString } from "@turf/turf";
import { FunnelIcon, MapPinIcon } from "lucide-react";
import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Marker, Popup, useMap } from "react-map-gl/maplibre";
import { NodeDetail } from "../../components/PageComponents/Map/NodeDetail.tsx";
import { Avatar } from "../../components/UI/Avatar.tsx";


const DeviceInfoPage = () => {
  const { getNodes, waypoints, hasNodeError } = useDevice();

  return (
    <PageLayout label="Device Info" noPadding actions={[]} leftBar={<Sidebar />}>
      <>Test</>
    </PageLayout>
  );
};

export default DeviceInfoPage;
