import { useEffect, useState, KeyboardEvent } from 'react';
import {
  Box,
  Image,
  Text,
  Input,
  Link,
  Select,
  Heading,
  Center,
} from '@chakra-ui/react';
import './App.css';
import { Button } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import { IoCloudDownloadOutline } from 'react-icons/io5';
import { AiOutlineLoading } from 'react-icons/ai';

enum entityTypes {
  Album = 'album',
  Track = 'musicTrack',
}

interface IResult {
  artistName: string;
  collectionName: string;
  artworkUrl100: string;
  collectionId: number;
}

function App() {
  const [results, setResults] = useState<IResult[]>([]);
  const [type, setType] = useState<entityTypes>(entityTypes.Album);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [term, setTerm] = useState<string>('John Lennon');
  const [searchingFor, setSearchingFor] = useState<string>('Album');
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value as entityTypes);
  };

  useEffect(() => {
    switch (type) {
      case 'musicTrack':
        setSearchingFor('Track');
        break;
      case 'album':
        setSearchingFor('Album');
        break;
      default:
        setSearchingFor('Album');
    }
  }, [type]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      setResults([]);
      getArtwork();
    }
  };

  const getThumb = (url: string, size: string): string => {
    if (!url) return '';
    return url.replace('100x100bb', `${size}x${size}bb`);
  };

  const getArtwork = () => {
    setIsSearching(true);
    fetch(
      `https://itunes.apple.com/search?term=${term}&country=gb&entity=${type}&limit=20`
    )
      .then((response) => response.json())
      .then((data) => {
        setResultCount(data.resultCount);
        setHasSearched(true);
        setResults(data.results);
      })
      .finally(() => setIsSearching(false))
      .catch((error) => {
        setIsSearching(false);
        console.log(error);
      });
  };

  const linkProps = {
    _hover: {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: '#ff9393',
    },
    display: 'flex',
    fontWeight: '500',
    alignItems: 'center',
    gap: '2',
    my: 2,
  };

  return (
    <>
      <Box sx={{ letterSpacing: '-1px' }} bg="gray.800" pb={6} pt={1}>
        <Container maxW="960px" bg="gray.800" color="white">
          <Heading
            sx={{ textTransform: 'lowercase' }}
            fontWeight="lighter"
            as="h1"
            size="lg"
            noOfLines={1}
          >
            Apple music
          </Heading>
          <Heading mt={-2} pl={2} as="h2" size="xl" noOfLines={1}>
            Artwork Searcher
          </Heading>
        </Container>
      </Box>
      <Container py={4} maxW="900px">
        <SimpleGrid columns={2} spacing="40px">
          <Box py={4} w={'70%'}>
            <Select
              value={type}
              placeholder="Looking for:"
              onChange={() => handleChange}
            >
              <option value="album">Album</option>
              <option value="musicTrack">Track</option>
            </Select>
          </Box>
          <Box py={4} w={'70%'}>
            <Input
              variant="outline"
              placeholder={`${searchingFor} name`}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e as KeyboardEvent)}
            />
          </Box>
        </SimpleGrid>
        <Button onClick={getArtwork} colorScheme="blue">
          Find artwork
        </Button>
      </Container>
      <Container maxW="900px" mb={6}>
        {hasSearched && (
          <Text py={3} fontSize="lg">
            {results.length > 0
              ? `Displaying ${resultCount} results`
              : 'No results'}
          </Text>
        )}

        <SimpleGrid columns={[2, null, 3]} spacing="40px">
          {results &&
            results.map((result) => {
              const hasImage = result.artworkUrl100;
              return (
                <Box
                  key={result.collectionId}
                  maxW="sm"
                  borderWidth="1px"
                  borderColor={'#e4e4e4'}
                  borderRadius="lg"
                  bg={'gray.800'}
                >
                  {hasImage && (
                    <Image
                      src={getThumb(result.artworkUrl100, '270')}
                      alt={result.collectionName}
                      width="100%"
                    />
                  )}
                  <Box color="#FF5E5E" p="4" pb={5}>
                    <Box mb={4}>
                      <Text fontWeight="semibold" fontSize="xl">
                        {result.artistName}
                      </Text>
                      <Text
                        fontSize="sm"
                        fontWeight="normal"
                        letterSpacing="wide"
                      >
                        {result?.collectionName}
                      </Text>
                    </Box>
                    {hasImage ? (
                      <Box
                        fontWeight="500"
                        alignItems={'center'}
                        gap={2}
                        my={2}
                      >
                        <Link
                          {...linkProps}
                          href={getThumb(result.artworkUrl100, '600')}
                          isExternal
                        >
                          <IoCloudDownloadOutline />
                          Standard res (600px)
                        </Link>
                        <Link
                          {...linkProps}
                          href={getThumb(result.artworkUrl100, '2000')}
                          isExternal
                        >
                          <IoCloudDownloadOutline />
                          Highest res (2000px)
                        </Link>
                      </Box>
                    ) : (
                      `No artwork for ${result.collectionName}`
                    )}
                  </Box>
                </Box>
              );
            })}
        </SimpleGrid>
        {isSearching && (
          <Center className="loading">
            <AiOutlineLoading />
          </Center>
        )}
      </Container>
    </>
  );
}

export default App;
