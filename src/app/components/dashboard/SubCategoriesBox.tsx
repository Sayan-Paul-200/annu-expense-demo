import { Paper, Title, Box, Group, Text, ScrollArea } from '@mantine/core';

interface SubCategoryItem {
  label: string;
  category: string;
  value: number;
  bgColor: string;
  icon: string;
}

interface SubCategoriesBoxProps {
  items: SubCategoryItem[];
  totalValue: number;
}

export function SubCategoriesBox({ items, totalValue }: SubCategoriesBoxProps) {
  return (
    <Paper withBorder radius="md" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '400px' }}>
      <Box p="md" pb="xs">
        <Title order={5} fw={600} c="#374151">
          Sub-Categories Breakdown
        </Title>
      </Box>

      <ScrollArea style={{ flex: 1 }} px="md" type="hover" offsetScrollbars>
        <Box pb="xs">
          {items.map((item, index) => (
            <Group
              key={index}
              justify="space-between"
              wrap="nowrap"
              style={{
                backgroundColor: item.bgColor,
                borderRadius: '6px',
                padding: '6px 10px',
                marginBottom: '8px',
              }}
            >
              <Group gap="xs" wrap="nowrap">
                <Text size="sm">{item.icon}</Text>
                <Box>
                  <Text size="sm" fw={500} c="#374151" truncate style={{ maxWidth: '140px', lineHeight: 1.2 }}>
                    {item.label}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ fontSize: '10px' }}>
                    {item.category}
                  </Text>
                </Box>
              </Group>
              <Box
                style={{
                  backgroundColor: '#FEF3C7',
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                <Text size="xs" fw={700} c="#111827">
                  ₹ {item.value.toFixed(2)}
                </Text>
              </Box>
            </Group>
          ))}
        </Box>
      </ScrollArea>

      <Box p="md" mt="auto" style={{ backgroundColor: '#F3F4F6', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px' }}>
        <Group justify="space-between">
          <Text size="sm" fw={700} c="#111827">
            Total
          </Text>
          <Text size="sm" fw={700} c="#111827">
            ₹ {totalValue.toFixed(2)}
          </Text>
        </Group>
      </Box>
    </Paper>
  );
}
