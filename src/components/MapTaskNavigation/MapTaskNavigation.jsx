import './style.scss';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTask } from '../../features/task/taskSlice';

function MapTaskNavigation() {
  const dispatch = useDispatch();
  const selectedTask = useSelector((state) => state.task.selectedTask);

  const handleTaskClick = (task) => {
    dispatch(setSelectedTask(task));
  };

  const tasks = [
    'Site',
    'Streets',
    'Cluster',
    'Public',
    'Subdivision',
    'Footprint',
    'Starter buildings',
    'Consolidated buildings',
  ];

  return (
    <Container fluid className="no-padding">
      <ul className="map-task-navigation">
        {tasks.map((task) => (
          <li
            key={task}
            className={
              task === selectedTask
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
}

export default MapTaskNavigation;
