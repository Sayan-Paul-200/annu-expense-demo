import { Group, Select, Button, Box } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconFilter, IconCalendar, IconX } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface DashboardFiltersProps {
  businessUnits: string[];
  projects: string[];
  states: string[];
  statuses?: string[];
  categories: string[];
  subCategories: Record<string, string[]>;
  selectedBusinessUnit?: string | null;
  onBusinessUnitChange?: (value: string | null) => void;
  businessUnitPlaceholder?: string;
  selectedProject?: string | null;
  onProjectChange?: (value: string | null) => void;
  projectPlaceholder?: string;
  selectedState?: string | null;
  onStateChange?: (value: string | null) => void;
  statePlaceholder?: string;
  selectedStatus?: string | null;
  onStatusChange?: (value: string | null) => void;
  selectedCategory: string | null;
  onCategoryChange: (value: string | null) => void;
  selectedSubCategory: string | null;
  onSubCategoryChange: (value: string | null) => void;
  selectedDateRange?: [string | null, string | null];
  onDateRangeChange?: (value: [string | null, string | null]) => void;
  onClear?: () => void;
}

export function DashboardFilters({ 
  businessUnits, 
  projects, 
  states, 
  statuses,
  categories, 
  subCategories,
  selectedBusinessUnit,
  onBusinessUnitChange,
  businessUnitPlaceholder = 'All Business Units',
  selectedProject,
  onProjectChange,
  projectPlaceholder = 'All Projects',
  selectedState,
  onStateChange,
  statePlaceholder = 'All States',
  selectedStatus,
  onStatusChange,
  selectedCategory,
  onCategoryChange,
  selectedSubCategory,
  onSubCategoryChange,
  selectedDateRange,
  onDateRangeChange,
  onClear,
}: DashboardFiltersProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <Box>
      <Group justify="space-between" hiddenFrom="md">
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
          {businessUnits.length > 0 && (
            <Select
              placeholder={businessUnitPlaceholder}
              data={businessUnits}
              value={selectedBusinessUnit}
              onChange={onBusinessUnitChange}
              style={{ flex: '1 1 180px' }}
              clearable
            />
          )}
          {projects.length > 0 && (
            <Select
              placeholder={projectPlaceholder}
              data={projects}
              value={selectedProject}
              onChange={onProjectChange}
              style={{ flex: '1 1 180px' }}
              clearable
            />
          )}
          {states.length > 0 && (
            <Select
              placeholder={statePlaceholder}
              data={states}
              value={selectedState}
              onChange={onStateChange}
              style={{ flex: '1 1 180px' }}
              clearable
            />
          )}
          {statuses && statuses.length > 0 && (
            <Select
              placeholder="All Statuses"
              data={statuses}
              value={selectedStatus}
              onChange={onStatusChange}
              style={{ flex: '1 1 180px' }}
              clearable
            />
          )}
          <Select
            placeholder="All Categories"
            data={categories}
            value={selectedCategory}
            onChange={onCategoryChange}
            style={{ flex: '1 1 180px' }}
            clearable
          />
          
          {selectedCategory && (
            <Select
              placeholder="All Sub-Categories"
              data={subCategories[selectedCategory] || []}
              value={selectedSubCategory}
              onChange={onSubCategoryChange}
              style={{ flex: '1 1 180px' }}
              clearable
            />
          )}

          <DatePickerInput
            type="range"
            placeholder="Select Date Range or FY"
            leftSection={<IconCalendar size={16} color="gray" />}
            value={selectedDateRange}
            onChange={onDateRangeChange}
            style={{ flex: '1 1 250px' }}
            clearable
          />
          <Button 
            variant="light" 
            color="gray" 
            leftSection={<IconX size={16} />}
            style={{ flex: '0 0 auto' }}
            onClick={() => {
              if (onClear) {
                onClear();
              } else {
                onCategoryChange(null);
                onSubCategoryChange(null);
              }
            }}
          >
            Clear
          </Button>
        </Group>
      </Box>
    </Box>
  );
}
