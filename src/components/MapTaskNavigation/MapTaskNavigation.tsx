import './style.scss';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from '../../features/task/taskSlice';
import type { FC } from 'react';
import type { RootState } from '../../app/store';

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

  const handleTaskClick = (task: string) => {
    dispatch(setSelectedTask(task));
  };

  return (
    <Container fluid className="no-padding">
      <ul className="map-task-navigation">
        {tasks.map((task) => (
          <li
            key={task}
            className={
              task === currentTask
                ? 'map-task-navigation-item task-active'
                : 'map-task-navigation-item'
            }
            onClick={() => handleTaskClick(task)}
          >
            {task}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default MapTaskNavigation;
