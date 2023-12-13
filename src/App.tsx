import { useEffect, useState } from 'react';
import { Box, Text, Input, Select, Heading, Center } from '@chakra-ui/react';
import './App.css';
import { Button } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { SimpleGrid } from '@chakra-ui/react';
import { AiOutlineLoading } from 'react-icons/ai';
import Result from './components/result';

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      setResults([]);
      getArtwork();
    }
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
              onChange={(e) => setTerm(e.target.value.replace(' ', '+'))}
              onKeyDown={(e) => handleKeyDown(e)}
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
              return <Result result={result} />;
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
