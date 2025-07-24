import { PageLayout } from "@components/PageLayout.tsx";
import { Sidebar } from "@components/Sidebar.tsx";
import { cn } from "@core/utils/cn.ts";
import { CpuIcon, LucideIcon, ZapIcon } from "lucide-react";
import { t } from "i18next";
import BatteryStatus from "@app/components/BatteryStatus.tsx";
import { DeviceMetrics } from "@app/components/types.ts";
import { Subtle } from "@app/components/UI/Typography/Subtle.tsx";

interface DeviceInfoProps {
  isCollapsed: boolean;
  deviceMetrics: DeviceMetrics;
  firmwareVersion: string;
  user: {
    shortName: string;
    longName: string;
  };
  setDialogOpen: () => void;
  setCommandPaletteOpen: () => void;
  disableHover?: boolean;
}

export const DeviceInfoPage = ({
  deviceMetrics,
  firmwareVersion,
}: DeviceInfoProps) => {

  interface InfoDisplayItem {
    id: string;
    label: string;
    icon?: LucideIcon;
    customComponent?: React.ReactNode;
    value?: string | number | null;
  }

  const { batteryLevel, voltage } = deviceMetrics;

  const deviceInfoItems: InfoDisplayItem[] = [
    {
      id: "battery",
      label: t("batteryStatus.title"),
      customComponent: <BatteryStatus deviceMetrics={deviceMetrics} />,
      value: batteryLevel !== undefined ? `${batteryLevel}%` : "N/A",
    },
    {
      id: "voltage",
      label: t("batteryVoltage.title"),
      icon: ZapIcon,
      value:
        voltage !== undefined
          ? `${voltage?.toPrecision(3)} V`
          : t("unknown.notAvailable", "N/A"),
    },
    {
      id: "firmware",
      label: t("sidebar.deviceInfo.firmware.title"),
      icon: CpuIcon,
      value: firmwareVersion ?? t("unknown.notAvailable", "N/A"),
    },
  ];

  return (
    <PageLayout label="Device Info" noPadding actions={[]} leftBar={<Sidebar />}>
      <div
        className={cn(
          "flex flex-col gap-2 mt-1",
          "transition-all duration-300 ease-in-out",
          "opacity-100 max-w-xs h-auto visible",
        )}
      >
        {deviceInfoItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div key={item.id} className="flex items-center gap-2.5 text-sm">
              {IconComponent && (
                <IconComponent
                  size={16}
                  className="text-gray-500 dark:text-gray-400 w-4 flex-shrink-0"
                />
              )}
              {item.customComponent}
              {item.id !== "battery" && (
                <Subtle className="text-gray-600 dark:text-gray-300">
                  {item.label}: {item.value}
                </Subtle>
              )}
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default DeviceInfoPage;