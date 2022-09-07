import type React from "react";
import { useEffect, useState } from "react";

import { FormField, Switch, TextInputField } from "evergreen-ui";
import { Controller, useForm, useWatch } from "react-hook-form";

import { MQTTValidation } from "@app/validation/moduleConfig/mqtt.js";
import { Form } from "@components/form/Form";
import { useDevice } from "@core/providers/useDevice.js";
import { classValidatorResolver } from "@hookform/resolvers/class-validator";

export const MQTT = (): JSX.Element => {
  const { moduleConfig, connection } = useDevice();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
  } = useForm<MQTTValidation>({
    defaultValues: moduleConfig.mqtt,
    resolver: classValidatorResolver(MQTTValidation),
  });

  const moduleEnabled = useWatch({
    control,
    name: "enabled",
    defaultValue: false,
  });

  useEffect(() => {
    reset(moduleConfig.mqtt);
  }, [reset, moduleConfig.mqtt]);

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    void connection?.setModuleConfig(
      {
        payloadVariant: {
          oneofKind: "mqtt",
          mqtt: data,
        },
      },
      async () => {
        reset({ ...data });
        setLoading(false);
        await Promise.resolve();
      }
    );
  });
  return (
    <Form loading={loading} dirty={isDirty} onSubmit={onSubmit}>
      <FormField
        label="Module Enabled"
        description="Description"
        isInvalid={!!errors.enabled?.message}
        validationMessage={errors.enabled?.message}
      >
        <Controller
          name="enabled"
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch height={24} marginLeft="auto" checked={value} {...field} />
          )}
        />
      </FormField>
      <TextInputField
        label="MQTT Server Address"
        description="Description"
        disabled={!moduleEnabled}
        {...register("address")}
      />
      <TextInputField
        label="MQTT Username"
        description="Description"
        disabled={!moduleEnabled}
        {...register("username")}
      />
      <TextInputField
        label="MQTT Password"
        description="Description"
        type="password"
        autoComplete="off"
        disabled={!moduleEnabled}
        {...register("password")}
      />
      <FormField
        label="Encryption Enabled"
        description="Description"
        disabled={!moduleEnabled}
        isInvalid={!!errors.encryptionEnabled?.message}
        validationMessage={errors.encryptionEnabled?.message}
      >
        <Controller
          name="encryptionEnabled"
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch height={24} marginLeft="auto" checked={value} {...field} />
          )}
        />
      </FormField>
      <FormField
        label="JSON Output Enabled"
        description="Description"
        disabled={!moduleEnabled}
        isInvalid={!!errors.jsonEnabled?.message}
        validationMessage={errors.jsonEnabled?.message}
      >
        <Controller
          name="jsonEnabled"
          control={control}
          render={({ field: { value, ...field } }) => (
            <Switch height={24} marginLeft="auto" checked={value} {...field} />
          )}
        />
      </FormField>
    </Form>
  );
};
