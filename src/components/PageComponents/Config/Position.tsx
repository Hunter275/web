import type { PositionValidation } from "@app/validation/config/position.js";
import { DynamicForm } from "@components/Form/DynamicForm.js";
import { Device, useDevice } from "@core/stores/deviceStore.js";
import { Protobuf, Types } from "@meshtastic/js";

export const Position = (device: Device): JSX.Element => {
  const { config, nodes, hardware, setWorkingConfig, addPosition } = useDevice();

  const onSubmit = (data: PositionValidation) => {
    device.addPosition(new Types.PacketMetadata<Protobuf.Mesh.Position>);
    setWorkingConfig(
      new Protobuf.Config.Config({
        payloadVariant: {
          case: "position",
          value: data,
        },
      }),
    );
  };

  return (
    <DynamicForm<PositionValidation>
      onSubmit={onSubmit}
      defaultValues={config.position}
      fieldGroups={[
        {
          label: "Position Settings",
          description: "Settings for the position module",
          fields: [
            {
              type: "toggle",
              name: "positionBroadcastSmartEnabled",
              label: "Enable Smart Position",
              description:
                "Only send position when there has been a meaningful change in location",
            },
            {
              type: "select",
              name: "gpsMode",
              label: "GPS Mode",
              description:
                "Configure whether device GPS is Enabled, Disabled, or Not Present",
              properties: {
                enumValue: Protobuf.Config.Config_PositionConfig_GpsMode,
              },
            },
            {
              type: "toggle",
              name: "fixedPosition",
              label: "Fixed Position",
              description:
                "Don't report GPS position, but a manually-specified one",
            },
            {
              type: "text",
              name: "fixedPosition",
              label: "Longitude",
              description:
                "Don't report GPS position, but a manually-specified one",
            },
            {
              type: "text",
              name: "fixedPosition",
              label: "Latitude",
              description:
                "Don't report GPS position, but a manually-specified one",
            },
            {
              type: "text",
              name: "fixedPosition",
              label: "Altitude",
              description:
                "Don't report GPS position, but a manually-specified one",
            },
            {
              type: "multiSelect",
              name: "positionFlags",
              label: "Position Flags",
              description: "Configuration options for Position messages",
              properties: {
                enumValue: Protobuf.Config.Config_PositionConfig_PositionFlags,
              },
            },
            {
              type: "number",
              name: "rxGpio",
              label: "Receive Pin",
              description: "GPS module RX pin override",
            },
            {
              type: "number",
              name: "txGpio",
              label: "Transmit Pin",
              description: "GPS module TX pin override",
            },
            {
              type: "number",
              name: "gpsEnGpio",
              label: "Enable Pin",
              description: "GPS module enable pin override",
            },
            {
              type: "number",
              name: "channelPrecision",
              label: "Channel Precision",
              description: "GPS channel precision",
            },
          ],
        },
        {
          label: "Intervals",
          description: "How often to send position updates",
          fields: [
            {
              type: "number",
              name: "positionBroadcastSecs",
              label: "Broadcast Interval",
              description: "How often your position is sent out over the mesh",
              properties: {
                suffix: "Seconds",
              },
            },
            {
              type: "number",
              name: "gpsUpdateInterval",
              label: "GPS Update Interval",
              description: "How often a GPS fix should be acquired",
              properties: {
                suffix: "Seconds",
              },
            },
            {
              type: "number",
              name: "broadcastSmartMinimumDistance",
              label: "Smart Position Minimum Distance",
              description:
                "Minimum distance (in meters) that must be traveled before a position update is sent",
              disabledBy: [
                {
                  fieldName: "positionBroadcastSmartEnabled",
                },
              ],
            },
            {
              type: "number",
              name: "broadcastSmartMinimumIntervalSecs",
              label: "Smart Position Minimum Interval",
              description:
                "Minimum interval (in seconds) that must pass before a position update is sent",
              disabledBy: [
                {
                  fieldName: "positionBroadcastSmartEnabled",
                },
              ],
            },
          ],
        },
      ]}
    />
  );
};
