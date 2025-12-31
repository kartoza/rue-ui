import { useEffect } from 'react';
import { Spinner, TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { MdError } from 'react-icons/md';
import {
  setCurrentStep,
  siteDefinition,
  STEP_LABELS,
  StepType,
} from '../../redux/reducers/stepSlice.ts';
import type { RootState } from '../../redux/store';
import {
  useCurrentProjectStep,
  useCurrentProjectUUID,
} from '../../redux/selectors/projectSelector.ts';
import { useCurrentStepUpdateLoading } from '../../redux/selectors/stepUpdateSelector.ts';
import { TaskStatus } from '../../redux/reducers/task.ts';
import { setDrawingMode } from '../../redux/reducers/global.ts';

import './style.scss';

interface TabPanelProps {
  value: string;
  label: string;
}

function TabPanel({ value, label }: TabPanelProps) {
  const currentStep = useCurrentProjectStep(value as StepType);
  const currentStepUpdateLoading = useCurrentStepUpdateLoading();

  return (
    <TabsTrigger
      value={value}
      disabled={currentStep?.step?.task?.status !== TaskStatus.success || currentStepUpdateLoading}
      className="map-task-tab-trigger"
    >
      {label}{' '}
      {(currentStep?.step?.task?.status === TaskStatus.pending ||
        currentStep?.step?.task?.status === TaskStatus.running) && <Spinner />}
      {currentStep?.step?.task?.status === TaskStatus.failed && (
        <MdError style={{ color: 'red' }} title={currentStep?.step?.task?.message || ''} />
      )}
    </TabsTrigger>
  );
}

function TabSiteDefinitionPanel({ value, label }: TabPanelProps) {
  return (
    <TabsTrigger value={value} className="map-task-tab-trigger">
      {label}
    </TabsTrigger>
  );
}

export default function MapTabNavigation() {
  const dispatch = useDispatch();
  const currentStep = useSelector((state: RootState) => state.step.currentStep);
  const currentUUID = useCurrentProjectUUID();

  const handleValueChange = (details: { value: string }) => {
    dispatch(setCurrentStep(details.value as StepType));
    dispatch(setDrawingMode(null));
  };

  // When project changed, change to site definition step
  useEffect(() => {
    dispatch(setCurrentStep(siteDefinition as StepType));
  }, [currentUUID, dispatch]);

  return (
    <TabsRoot value={currentStep} onValueChange={handleValueChange} variant="plain">
      <TabsList className="map-task-tabs-list">
        <TabSiteDefinitionPanel value={siteDefinition} label={siteDefinition} />
        {Object.entries(STEP_LABELS)
          .filter(([value]) => {
            return ![
              StepType.footprint as string,
              StepType.building_start as string,
              StepType.building_max as string,
            ].includes(value);
          })
          .map(([value, label]) => (
            <TabPanel key={value} value={value} label={label} />
          ))}
      </TabsList>
    </TabsRoot>
  );
}
