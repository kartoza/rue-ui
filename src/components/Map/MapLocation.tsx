import { Map } from 'maplibre-gl';
import parse from 'html-react-parser';
import { useEffect, useRef, useState } from 'react';
import { MdClose, MdMyLocation, MdSearch } from 'react-icons/md';
import { Box, HStack, Input, Spinner, VStack } from '@chakra-ui/react';
import { type NominatimResponse, searchOSM } from '../../utils/osm.tsx';
import { Toaster } from '../Toaster/toaster.ts';

import './style.scss';

interface MapLocationProps {
  map?: Map | null;
}

/**
 * Map location input component.
 * @param map
 * @constructor
 */
export default function MapLocation({ map }: MapLocationProps) {
  const [value, setValue] = useState<string>('');
  const [searchResults, setSearchResults] = useState<NominatimResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * Parse coordinates from input value.
   * Need to be exact 2 numbers separated by comma.
   */
  const parseCoordinates = () => {
    const parts = value.split(',').map((s) => s.trim());
    if (parts.length !== 2) return null;

    // Check if both parts are numbers
    const lat = parseFloat(parts[0]);
    if (isNaN(lat)) return null;
    const lng = parseFloat(parts[1]);
    if (isNaN(lng)) return null;

    return {
      latitude: lat,
      longitude: lng,
    };
  };

  // Debounced search effect
  useEffect(() => {
    // If input is empty or too short, clear results
    if (value.length < 3) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Debounce search
    const timeoutId = setTimeout(async () => {
      let results: NominatimResponse[] = [];
      try {
        const coords = parseCoordinates();
        if (coords) {
          results = [
            {
              place_id: 0,
              display_name: `<b>Lng</b>: ${coords.latitude}, <b>Lat</b>: ${coords.longitude}`,
              lat: coords.latitude,
              lon: coords.longitude,
              boundingbox: null,
            },
            {
              place_id: 1,
              display_name: `<b>Lat</b>: ${coords.latitude}, <b>Lng</b>: ${coords.longitude}`,
              lat: coords.longitude,
              lon: coords.latitude,
              boundingbox: null,
            },
          ];
        } else {
          results = await searchOSM(value);
        }
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [value]);

  /** If click outside of dropdown, close it **/
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /** Handle the result **/
  const handleSelectResult = (result: NominatimResponse) => {
    if (map) {
      // If boundingbox exists, fit to bbox
      if (result.boundingbox && result.boundingbox.length === 4) {
        const [south, north, west, east] = result.boundingbox;
        map.fitBounds(
          [
            [Number(west), Number(south)],
            [Number(east), Number(north)],
          ],
          { padding: 50 }
        );
      } else {
        // Otherwise, zoom to lat/lng
        map.flyTo({
          center: [Number(result.lon), Number(result.lat)],
          zoom: 13,
        });
      }
    }
  };

  const handleClear = () => {
    setValue('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const handleMyLocation = () => {
    if (!map) return;

    if (!navigator.geolocation) {
      Toaster.error('Geolocation Error', 'Your browser does not support geolocation');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo({ center: [longitude, latitude], zoom: 15 });
      },
      (error) => {
        let message = 'Unable to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Location permission denied. Please enable location access.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Location information unavailable.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Location request timed out.';
        }
        Toaster.error('Geolocation Error', message);
      }
    );
  };

  return (
    <Box position="absolute" top="10px" left="10px" zIndex={1} ref={dropdownRef}>
      <Box position="relative" flex={1}>
        <HStack bg="white" borderRadius="md" boxShadow="md" px={2} gap={0}>
          <Box
            display="flex"
            alignItems="center"
            style={{
              borderRight: '1px solid #e4e4e7',
              marginRight: '0.5rem',
              paddingRight: '0.5rem',
            }}
          >
            <MdMyLocation
              style={{
                fontSize: '1.3rem',
                opacity: 0.5,
                cursor: 'pointer',
              }}
              onClick={handleMyLocation}
              title="Zoom to your current location"
            />
          </Box>
          <MdSearch style={{ fontSize: '1.3rem', opacity: 0.5 }} />
          <Input
            placeholder="40.7128, -74.0060 or text"
            value={value}
            fontSize="0.9rem"
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              if (searchResults.length > 0) {
                setShowDropdown(true);
              }
            }}
            minWidth="250px"
            border="none"
            outline="none"
            _focus={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            _active={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
          />
          {isLoading ? (
            <Spinner size="sm" style={{ fontSize: '1.3rem' }} />
          ) : (
            <MdClose
              onClick={handleClear}
              cursor={value ? 'pointer' : 'default'}
              style={{ fontSize: '1.3rem', opacity: 0.5 }}
            />
          )}
        </HStack>

        {/* Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <VStack
            position="absolute"
            top="100%"
            left={0}
            right={0}
            bg="white"
            borderRadius="md"
            boxShadow="lg"
            mt={1}
            maxHeight="300px"
            overflowY="auto"
            align="stretch"
            gap={0}
          >
            {searchResults.map((result) => (
              <Box
                key={result.place_id}
                px={3}
                py={2}
                cursor="pointer"
                _hover={{ bg: 'gray.100' }}
                borderBottom="1px solid"
                borderColor="gray.200"
                _last={{ borderBottom: 'none' }}
                onClick={() => handleSelectResult(result)}
              >
                <Box fontSize="0.9rem">{parse(result.display_name)}</Box>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
}
