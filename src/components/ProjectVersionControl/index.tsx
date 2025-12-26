import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  useCurrentProjectDone,
  useCurrentProjectUpdate,
  useCurrentProjectUUID,
} from '../../redux/selectors/projectSelector.ts';
import { Toaster } from '../Toaster/toaster.ts';
import { get } from '../../utils/api';
import { getProject } from '../../redux/reducers/projectSlice.ts';
import type { AppDispatch } from '../../redux/store.ts';

export default function ProjectVersionControl() {
  const currentProjectUpdate = useCurrentProjectUpdate();
  const uuid = useCurrentProjectUUID();
  const isProjectDone = useCurrentProjectDone();
  const dispatch = useDispatch<AppDispatch>();

  // Store the last known update timestamp
  const lastUpdateRef = useRef<string | undefined>(null);

  useEffect(() => {
    // Don't poll if there's no UUID
    if (!uuid || !isProjectDone || !currentProjectUpdate) {
      lastUpdateRef.current = null;
      return;
    }

    // Initialize with current update value
    lastUpdateRef.current = currentProjectUpdate;

    // Function to check for updates
    const checkForUpdates = async () => {
      // Store the current UUID at the time of the request
      const requestUuid = uuid;

      try {
        const response = await get<{ updated_at: string } | string>(
          'projects/' + requestUuid + '/updated_at'
        );

        // Check if UUID is still the same after the async request
        if (requestUuid !== uuid) {
          console.log('UUID changed during request, ignoring response');
          return;
        }
        console.log('Response:', response);
        const serverUpdate = typeof response === 'string' ? response : response.updated_at;

        // Compare with last known update
        if (
          lastUpdateRef.current !== null &&
          lastUpdateRef.current !== undefined &&
          serverUpdate !== lastUpdateRef.current
        ) {
          // Update has changed - call your update handler here
          console.log('Project updated:', {
            old: lastUpdateRef.current,
            new: serverUpdate,
          });
          handleProjectUpdate();
        }

        // Update the reference
        lastUpdateRef.current = serverUpdate;
      } catch (error) {
        console.error('Failed to check project updates:', error);
      }
    };

    // Function to handle project updates
    const handleProjectUpdate = () => {
      Toaster.warning('Project Updated', 'The project has been updated, reloading the project.');
      dispatch(
        getProject({
          uuid: uuid,
        })
      );
    };

    // Set up polling interval (5 seconds)
    const intervalId = setInterval(checkForUpdates, 5000);

    // Initial check
    void checkForUpdates();

    // Cleanup function - clear interval when UUID changes or component unmounts
    return () => {
      clearInterval(intervalId);
      lastUpdateRef.current = null;
    };
  }, [uuid, currentProjectUpdate, dispatch, isProjectDone]);

  return null;
}
