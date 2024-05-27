import { useDevice } from "@app/core/stores/deviceStore.js";
import type { Protobuf } from "@meshtastic/js";

export interface TraceRouteProps {
  from?: Protobuf.Mesh.NodeInfo;
  to?: Protobuf.Mesh.NodeInfo;
  route?: Protobuf.Mesh.RouteDiscovery;
}


export const TraceRoute = ({
  from,
  to,
  route,
}: TraceRouteProps): JSX.Element => {
  const { nodes } = useDevice();

  return route.length == 0 ? (
    <div className="ml-5 flex">
      <span className="ml-4 border-l-2 border-l-backgroundPrimary pl-2 text-textPrimary">
      {from?.user?.longName}↔{to?.user?.longName}
      </span>
    </div>
   ) : ( 
    <div className="ml-5 flex">
      <span className="ml-4 border-l-2 border-l-backgroundPrimary pl-2 text-textPrimary">
      {from?.user?.longName}↔
      {route.map((hop) => (
         nodes.get(hop)?.user?.longName ?? "Unknown" + "↔"
     ))}
      {to?.user?.longName}
      </span>
    </div>
  );
};