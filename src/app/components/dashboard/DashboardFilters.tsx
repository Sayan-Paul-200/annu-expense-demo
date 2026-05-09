import { Group, Select, Button, Box } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFilter, IconCalendar, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface DashboardFiltersProps {
  businessUnits: string[];
  projects: string[];
  states: string[];
  categories: string[];
  subCategories: Record<string, string[]>;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedSubCategory: string | null;
  onSubCategoryChange: (value: string | null) => void;
}

export function DashboardFilters({ 
  businessUnits, 
  projects, 
  states, 
  categories, 
  subCategories,
  selectedCategory,
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange
}: DashboardFiltersProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box mb="md">
      <Group justify="space-between" mb="sm" hiddenFrom="md">
        <Button variant="light" color="blue" onClick={toggle} leftSection={<IconFilter size={16} />}>
          Filters
        </Button>
      </Group>

      {opened && (
        <Box visibleFrom="md" style={{ display: 'block' }} />
      )}
      
      {/* On desktop, always show. On mobile, controlled by Collapse */}
      <Box display={{ base: opened ? 'block' : 'none', md: 'block' }}>
        <Group align="flex-end" gap="sm">
          <Select
            placeholder="All Business Units"
            data={businessUnits}
            style={{ flex: 1, minWidth: 150 }}
            clearable
          />
          <Select
            placeholder="All Projects"
            data={projects}
            style={{ flex: 1, minWidth: 150 }}
            clearable
          />
          <Select
            placeholder="All States"
            data={states}
            style={{ flex: 1, minWidth: 150 }}
            clearable
          />
          <Select
            placeholder="All Categories"
            data={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            style={{ flex: 1, minWidth: 150 }}
            clearable
          />
          
          {selectedCategory && (
            <Select
              placeholder="All Sub-Categories"
              data={subCategories[selectedCategory] || []}
              value={selectedSubCategory}
              onChange={onSubCategoryChange}
              style={{ flex: 1, minWidth: 150 }}
              clearable
            />
          )}

          <DatePickerInput
            type="range"
            placeholder="Select Date Range or FY"
            leftSection={<IconCalendar size={16} color="gray" />}
            style={{ flex: 1.5, minWidth: 220 }}
            clearable
          />
          <Button 
            variant="light" 
            color="gray" 
            leftSection={<IconX size={16} />}
            onClick={() => {
              onCategoryChange(null);
              onSubCategoryChange(null);
            }}
          >
            Clear
          </Button>
        </Group>
      </Box>
    </Box>
  );
}
