import type { RootState } from '../../redux/store';
import type { FC } from 'react';
import { TabsRoot, TabsList, TabsTrigger } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from '../../redux/reducers/taskSlice';

import './style.scss';

const tasks: string[] = [
  'Site',
  'Streets',
  'Cluster',
  'Public',
  'Subdivision',
  'Footprint',
  'Starter buildings',
  'Consolidated buildings',
];

const MapTaskNavigation: FC = () => {
  const dispatch = useDispatch();
  const currentTask = useSelector((state: RootState) => state.task.currentTask);

  const handleValueChange = (details: { value: string }) => {
    dispatch(setSelectedTask(details.value));
  };

  return (
    <TabsRoot value={currentTask} onValueChange={handleValueChange} variant="plain">
      <TabsList className="map-task-tabs-list">
        {tasks.map((task) => (
          <TabsTrigger key={task} value={task} className="map-task-tab-trigger">
            {task}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
};

export default MapTaskNavigation;
