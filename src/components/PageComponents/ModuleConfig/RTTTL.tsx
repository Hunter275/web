import type { RangeTestValidation } from "@app/validation/moduleConfig/rangeTest.js";
import { DynamicForm } from "@components/Form/DynamicForm.js";
import { useDevice } from "@core/stores/deviceStore.js";
import { Protobuf } from "@meshtastic/js";

export const RTTTL = (): JSX.Element => {
  const { nodes, config, moduleConfig, setWorkingModuleConfig } = useDevice();

  const onSubmit = (data: RangeTestValidation) => {
    // setWorkingModuleConfig(
    //   new Protobuf.ModuleConfig.ModuleConfig({
    //     payloadVariant: {
    //       case: "rangeTest",
    //       value: data,
    //     },
    //   }),
    // );
  };

  return (
    <DynamicForm<RangeTestValidation>
      onSubmit={onSubmit}
      defaultValues={moduleConfig.rangeTest}
      fieldGroups={[
        {
          label: "Ringtone (RTTTL) Settings",
          description: "Settings for Ring Tone Text Transfer Language (RTTTL)",
          fields: [
            {
              type: "text",
              name: "enabled",
              label: "Ringtone",
              description: "String used by supported buzzer in external notifications.",
            }
          ],
        },
      ]}
    />
  );
};
