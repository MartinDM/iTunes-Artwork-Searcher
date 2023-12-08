import { useState } from 'react';
import { Box, Card, Heading } from '@chakra-ui/react';
import './App.css';
import { Button } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';

enum types {
  Album = 'album',
  Track = 'musicTrack',
  Artist = 'musicArtist',
}

function App() {
  const [results, setResults] = useState([]);
  const [type, setType] = useState<types>(types.Album);
  const [term, setTerm] = useState<string>('John Lennon');
  const [resultCount, setResultCount] = useState<number | null>(null);

  const getArtwork = () => {
    console.log('Fetching');
    fetch(
      `https://itunes.apple.com/search?term=${term}&country=gb&entity=${type}&limit=10`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setResults(data.results);
        setResultCount(data.resultCount);
      })
      .catch((error) => console.log(error));
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
      <Box p={3}>
        <Container maxW="960px">
          <Button onClick={() => getArtwork()} colorScheme="blue">
            Find artwork
          </Button>
        </Container>
        <Container maxW="960px">
          {Boolean(resultCount) &&
            results.map((result) => <Box>{result.artistName}</Box>)}
        </Container>
      </Box>
    </>
  );
}

export default App;
