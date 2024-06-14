import type { Message } from "@bufbuild/protobuf";
import type { Protobuf } from "@meshtastic/js";
import { IsString } from "class-validator";

export class RTTTLValidation
  implements
    Omit<Protobuf.ModuleConfig.ModuleConfig_ExternalNotificationConfig, keyof Message>
{
  save: boolean;
}
