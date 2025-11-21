import type { RootState } from '../../redux/store';
import { Spinner, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep, STEP_LABELS, type StepType } from '../../redux/reducers/stepSlice.ts';
import { useCurrentProjectStep } from '../../redux/selectors/projectSelector.ts';
import { TaskStatus } from '../../redux/reducers/task.ts';

import './style.scss';

interface TabPanelProps {
  value: string;
  label: string;
}

function TabPanel({ value, label }: TabPanelProps) {
  const currentStep = useCurrentProjectStep(value as StepType);

  return (
    <TabsTrigger
      value={value}
      disabled={currentStep?.step?.task?.status !== TaskStatus.success}
      className="map-task-tab-trigger"
    >
      {label}{' '}
      {(currentStep?.step?.task?.status === TaskStatus.pending ||
        currentStep?.step?.task?.status === TaskStatus.running) && <Spinner />}
    </TabsTrigger>
  );
}

export default function MapTabNavigation() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.currentStep);

  const handleValueChange = (details: { value: string }) => {
    dispatch(setCurrentStep(details.value as StepType));
  };

  return (
    <TabsRoot value={currentStep} onValueChange={handleValueChange} variant="plain">
      <TabsList className="map-task-tabs-list">
        {Object.entries(STEP_LABELS).map(([value, label]) => (
          <TabPanel key={value} value={value} label={label} />
        ))}
      </TabsList>
    </TabsRoot>
  );
}
