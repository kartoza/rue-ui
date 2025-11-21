import type { RootState } from '../../redux/store';
import { TabsList, TabsRoot, TabsTrigger } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentStep, STEP_LABELS, type StepType } from '../../redux/reducers/stepSlice.ts';

import './style.scss';

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
          <TabsTrigger key={value} value={value} disabled={true} className="map-task-tab-trigger">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
