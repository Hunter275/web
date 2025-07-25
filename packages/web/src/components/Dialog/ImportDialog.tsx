import { create, fromBinary } from "@bufbuild/protobuf";
import { Button } from "@components/UI/Button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/UI/Dialog.tsx";
import { Input } from "@components/UI/Input.tsx";
import { Label } from "@components/UI/Label.tsx";
import { Switch } from "@components/UI/Switch.tsx";
import { useDevice } from "@core/stores/deviceStore.ts";
import { Protobuf } from "@meshtastic/core";
import { toByteArray } from "base64-js";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox } from "../UI/Checkbox/index.tsx";

export interface ImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loraConfig?: Protobuf.Config.Config_LoRaConfig;
}

export const ImportDialog = ({ open, onOpenChange }: ImportDialogProps) => {
  const { t } = useTranslation("dialog");
  const [importDialogInput, setImportDialogInput] = useState<string>("");
  const [channelSet, setChannelSet] = useState<Protobuf.AppOnly.ChannelSet>();
  const [validUrl, setValidUrl] = useState<boolean>(false);

  const { connection } = useDevice();

  useEffect(() => {
    // the channel information is contained in the URL's fragment, which will be present after a
    // non-URL encoded `#`.
    try {
      const channelsUrl = new URL(importDialogInput);
      if (
        (channelsUrl.hostname !== "meshtastic.org" &&
          channelsUrl.pathname !== "/e/") ||
        !channelsUrl.hash
      ) {
        throw t("import.error.invalidUrl");
      }

      const encodedChannelConfig = channelsUrl.hash.substring(1);
      const paddedString = encodedChannelConfig
        .padEnd(
          encodedChannelConfig.length +
            ((4 - (encodedChannelConfig.length % 4)) % 4),
          "=",
        )
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      setChannelSet(
        fromBinary(
          Protobuf.AppOnly.ChannelSetSchema,
          toByteArray(paddedString),
        ),
      );
      setValidUrl(true);
    } catch (_error) {
      setValidUrl(false);
      setChannelSet(undefined);
    }
  }, [importDialogInput, t]);

  const apply = () => {
    channelSet?.settings.map(
      (ch: Protobuf.Channel.ChannelSettings, index: number) => {
        connection?.setChannel(
          create(Protobuf.Channel.ChannelSchema, {
            index,
            role:
              index === 0
                ? Protobuf.Channel.Channel_Role.PRIMARY
                : Protobuf.Channel.Channel_Role.SECONDARY,
            settings: ch,
          }),
        );
      },
    );

    if (channelSet?.loraConfig) {
      connection?.setConfig(
        create(Protobuf.Config.ConfigSchema, {
          payloadVariant: {
            case: "lora",
            value: channelSet.loraConfig,
          },
        }),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogClose />
        <DialogHeader>
          <DialogTitle>{t("import.title")}</DialogTitle>
          <DialogDescription>{t("import.description")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Label>{t("import.channelSetUrl")}</Label>
          <Input
            value={importDialogInput}
            suffix={validUrl ? "✅" : "❌"}
            onChange={(e) => {
              setImportDialogInput(e.target.value);
            }}
          />
          {validUrl && (
            <div className="flex flex-col gap-3">
              <div className="flex w-full gap-2">
                <div className="w-36">
                  <Label>{t("import.usePreset")}</Label>
                  <Switch
                    disabled
                    checked={channelSet?.loraConfig?.usePreset ?? true}
                  />
                </div>
                {/* <Select
                  label="Modem Preset"
                  disabled
                  value={channelSet?.loraConfig?.modemPreset}
                >
                  {renderOptions(Protobuf.Config_LoRaConfig_ModemPreset)}
                </Select> */}
              </div>
              {/* <Select
                label="Region"
                disabled
                value={channelSet?.loraConfig?.region}
              >
                {renderOptions(Protobuf.Config_LoRaConfig_RegionCode)}
              </Select> */}

              <span className="text-md block font-medium text-text-primary">
                {t("import.channels")}
              </span>
              <div className="flex w-40 flex-col gap-1">
                {channelSet?.settings.map((channel) => (
                  <div className="flex justify-between" key={channel.id}>
                    <Label>
                      {channel.name.length
                        ? channel.name
                        : `${t("import.channelPrefix")}${channel.id}`}
                    </Label>
                    <Checkbox key={channel.id} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={apply} disabled={!validUrl} name="apply">
            {t("button.apply")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
