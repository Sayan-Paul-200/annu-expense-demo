import { useState, useEffect, useMemo } from 'react';
import { SimpleGrid, Grid, Stack, Box, Group, Title, Button, LoadingOverlay } from '@mantine/core';
import { 
  IconFileInvoice, 
  IconReceiptTax, 
  IconDatabase, 
  IconCoinRupee, 
  IconCheckbox, 
  IconCalendarDue,
  IconPlus 
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import { dummyDashboardData } from './dummyData';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { DashboardFilters } from '../../components/dashboard/DashboardFilters';
import { SubCategoriesBox } from '../../components/dashboard/SubCategoriesBox';
import { ExpenseTrendAreaChart } from '../../components/dashboard/ExpenseTrendAreaChart';
import { TopCategoriesBarChart } from '../../components/dashboard/TopCategoriesBarChart';
import { ChartSkeleton } from '../../components/dashboard/ChartSkeleton';
import { ProjectBudgetTable } from '../../components/dashboard/ProjectBudgetTable';
import { CreateInvoiceModal } from '../../components/dashboard/CreateInvoiceModal';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);

  // Simulated initial loading state
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryChange = (val: string | null) => {
    setIsFiltering(true);
    setSelectedCategory(val);
    setSelectedSubCategory(null);
    setTimeout(() => setIsFiltering(false), 600);
  };

  const onSubCategoryChange = (val: string | null) => {
    setIsFiltering(true);
    setSelectedSubCategory(val);
    setTimeout(() => setIsFiltering(false), 600);
  };

  const filteredSubCategories = useMemo(() => {
    return dummyDashboardData.subCategoryBreakdown.filter(item => {
      let matches = true;
      if (selectedCategory) {
        matches = matches && item.category === selectedCategory;
      }
      if (selectedSubCategory) {
        matches = matches && item.label === selectedSubCategory;
      }
      return matches;
    });
  }, [selectedCategory, selectedSubCategory]);

  const filteredSubCategoryTotal = useMemo(() => {
    return filteredSubCategories.reduce((sum, item) => sum + item.value, 0);
  }, [filteredSubCategories]);

  const kpiData = [
    { title: 'Grand Total Expense', value: dummyDashboardData.kpis.invoiceBasicValue, icon: <IconFileInvoice size={24} />, color: 'blue' },
    { title: 'Company Total Expense', value: dummyDashboardData.kpis.invoiceGstAmount, icon: <IconReceiptTax size={24} />, color: 'green' },
    { title: 'Total B.U. Expense', value: dummyDashboardData.kpis.totalInvoiceAmount, icon: <IconDatabase size={24} />, color: 'grape' },
    { title: 'Total Project Budget', value: dummyDashboardData.kpis.netPayable, icon: <IconCoinRupee size={24} />, color: 'cyan' },
    { title: 'Utilized Budget', value: dummyDashboardData.kpis.totalPaidByClient, icon: <IconCheckbox size={24} />, color: 'lime' },
    { title: 'Balance Budget', value: dummyDashboardData.kpis.balancePending, icon: <IconCalendarDue size={24} />, color: 'red' },
  ];

  return (
    <Stack gap="lg" p="md" style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      
      <Group justify="space-between" align="center" className="cascade-animate" style={{ animationDelay: '0.1s' }}>
        <Box>
          <Title order={2} fw={700} c="gray.9">Expense Overview</Title>
          <Box style={{ fontSize: '14px', color: 'var(--mantine-color-dimmed)' }}>
            Real-time financial monitoring and budget tracking
          </Box>
        </Box>
        <Button 
          leftSection={<IconPlus size={18} />} 
          size="md" 
          radius="md" 
          onClick={openCreate}
          style={{ boxShadow: 'var(--mantine-shadow-sm)' }}
        >
          New Expense
        </Button>
      </Group>

      <Box className="cascade-animate" style={{ animationDelay: '0.2s' }}>
        <DashboardFilters 
          businessUnits={dummyDashboardData.filters.businessUnits}
          projects={dummyDashboardData.filters.projects}
          states={dummyDashboardData.filters.states}
          categories={dummyDashboardData.filters.categories}
          subCategories={dummyDashboardData.filters.subCategories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          selectedSubCategory={selectedSubCategory}
          onSubCategoryChange={onSubCategoryChange}
        />
      </Box>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
        {kpiData.map((kpi, index) => (
          <Box key={index} className="cascade-animate" style={{ animationDelay: `${0.3 + index * 0.05}s` }}>
            {loading ? (
              <ChartSkeleton type="kpi" />
            ) : (
              <KpiCard
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                color={kpi.color}
                isCurrency={true}
              />
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Box pos="relative">
        <LoadingOverlay visible={isFiltering} zIndex={10} overlayProps={{ radius: "sm", blur: 1 }} />
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 4, lg: 3 }} className="cascade-animate" style={{ animationDelay: '0.6s' }}>
            {loading ? (
              <ChartSkeleton type="deductions" />
            ) : (
              <SubCategoriesBox 
                items={filteredSubCategories} 
                totalValue={filteredSubCategoryTotal} 
              />
            )}
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 8, lg: 6 }} className="cascade-animate" style={{ animationDelay: '0.7s' }}>
            {loading ? (
              <ChartSkeleton type="bar" />
            ) : (
              <ExpenseTrendAreaChart data={dummyDashboardData.charts.expenseTrend} />
            )}
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 12, lg: 3 }} className="cascade-animate" style={{ animationDelay: '0.8s' }}>
            {loading ? (
              <ChartSkeleton type="donut" />
            ) : (
              <TopCategoriesBarChart data={dummyDashboardData.charts.topCategories} />
            )}
          </Grid.Col>
        </Grid>

        <Box mt="lg" className="cascade-animate" style={{ animationDelay: '0.9s' }}>
          {loading ? (
            <ChartSkeleton type="table" />
          ) : (
            <ProjectBudgetTable data={dummyDashboardData.projectBudgets} />
          )}
        </Box>
      </Box>

      <CreateInvoiceModal opened={createOpened} onClose={closeCreate} />
    </Stack>
  );
}
