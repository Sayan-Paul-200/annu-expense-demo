import { Modal, TextInput, Select, Button, Group, NumberInput, Textarea } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFilePlus, IconCalendar } from '@tabler/icons-react';

interface CreateInvoiceModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateInvoiceModal({ opened, onClose }: CreateInvoiceModalProps) {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={<Group gap="xs"><IconFilePlus size={20} color="#3B82F6" /><span style={{ fontWeight: 600 }}>Log New Expense / Invoice</span></Group>}
      size="lg"
      padding="xl"
      overlayProps={{ blur: 3, opacity: 0.55 }}
    >
      <Group grow mb="md" align="flex-start">
        <Select
          label="Business Unit"
          placeholder="Select BU"
          data={['Telecom', 'Gas Pipelines', 'Sewerage', 'Railways']}
          required
        />
        <Select
          label="Project"
          placeholder="Select Project"
          data={['BGCL', 'Bharat Net', 'GAIL', 'NFS', 'STP']}
          required
        />
      </Group>

      <Group grow mb="md" align="flex-start">
        <Select
          label="Category"
          placeholder="Select Category"
          data={['Material', 'Services', 'Plant & Machinery', 'Office', 'Vehicle']}
          required
        />
        <Select
          label="Vendor"
          placeholder="Select Vendor"
          data={['Acme Corp', 'Global Logistics', 'TechServe Ltd', 'Local Suppliers']}
          required
        />
      </Group>

      <Group grow mb="md" align="flex-start">
        <TextInput
          label="Invoice Number"
          placeholder="e.g. INV-2026-001"
          required
        />
        <DatePickerInput
          label="Invoice Date"
          placeholder="Pick date"
          leftSection={<IconCalendar size={16} />}
          required
        />
      </Group>

      <Group grow mb="lg" align="flex-start">
        <NumberInput
          label="Basic Amount (₹)"
          placeholder="0.00"
          thousandSeparator=","
          hideControls
          required
        />
        <NumberInput
          label="GST Amount (₹)"
          placeholder="0.00"
          thousandSeparator=","
          hideControls
        />
      </Group>

      <Textarea
        label="Remarks"
        placeholder="Any additional notes or justification..."
        mb="xl"
        minRows={3}
      />

      <Group justify="flex-end">
        <Button variant="default" onClick={onClose}>Cancel</Button>
        <Button color="blue" onClick={onClose}>Submit for Approval</Button>
      </Group>
    </Modal>
  );
}
