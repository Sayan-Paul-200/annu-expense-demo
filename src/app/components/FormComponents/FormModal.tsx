import { useState } from 'react';
import { Modal, Button, TextInput, Select, FileInput, Stack, Image, Group, Text, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePickerInput } from '@mantine/dates';

export type FieldType = 'Text' | 'Select' | 'Date' | 'File' | 'Number';

export interface FormFieldConfig {
  name: string;
  label: string;
  fieldType: FieldType;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  options?: { value: string; label: string }[]; // For Select
}

interface FormModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  fields: FormFieldConfig[];
  initialValues?: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}

export function FormModal({ opened, onClose, title, fields, initialValues, onSubmit }: FormModalProps) {
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm({
    initialValues: initialValues || fields.reduce((acc, field) => {
      acc[field.name] = field.fieldType === 'File' ? null : '';
      return acc;
    }, {} as Record<string, any>),
    validate: fields.reduce((acc, field) => {
      if (field.required) {
        acc[field.name] = (value: any) => (!value ? `${field.label} is required` : null);
      }
      return acc;
    }, {} as Record<string, any>),
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);
    try {
      let finalValues = { ...values };

      // Handle file upload preview/mock logic here
      const fileFields = fields.filter((f) => f.fieldType === 'File');
      for (const field of fileFields) {
        const file = values[field.name];
        if (file instanceof File) {
          // Mock upload endpoint
          // const formData = new FormData();
          // formData.append('file', file);
          // const res = await axios.post('/api/upload', formData);
          // finalValues[field.name] = res.data.url;
          console.log(`Uploading file ${file.name}`);
        }
      }

      await onSubmit(finalValues);
      form.reset();
      setPreviewImage(null);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (field: string, payload: File | null) => {
    form.setFieldValue(field, payload);
    if (payload) {
      const objectUrl = URL.createObjectURL(payload);
      setPreviewImage(objectUrl);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          {fields.map((field) => {
            if (field.hidden) return null;

            switch (field.fieldType) {
              case 'Text':
                return (
                  <TextInput
                    key={field.name}
                    label={field.label}
                    withAsterisk={field.required}
                    disabled={field.disabled}
                    {...form.getInputProps(field.name)}
                    className="formLabel"
                  />
                );
              case 'Select':
                return (
                  <Select
                    key={field.name}
                    label={field.label}
                    data={field.options || []}
                    withAsterisk={field.required}
                    disabled={field.disabled}
                    {...form.getInputProps(field.name)}
                    className="formLabel"
                  />
                );
              case 'Date':
                return (
                  <DatePickerInput
                    key={field.name}
                    label={field.label}
                    withAsterisk={field.required}
                    disabled={field.disabled}
                    {...form.getInputProps(field.name)}
                    className="formLabel"
                  />
                );
              case 'File':
                return (
                  <Box key={field.name}>
                    <FileInput
                      label={field.label}
                      withAsterisk={field.required}
                      disabled={field.disabled}
                      accept="image/png,image/jpeg"
                      onChange={(payload) => handleFileChange(field.name, payload)}
                      error={form.errors[field.name]}
                      className="formLabel"
                    />
                    {previewImage && (
                      <Group mt="sm">
                        <Text size="xs" c="dimmed">Preview:</Text>
                        <Image src={previewImage} h={80} w={80} fit="cover" radius="sm" />
                      </Group>
                    )}
                  </Box>
                );
              default:
                return null;
            }
          })}

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading} color="blue">
              Submit
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
