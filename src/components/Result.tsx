import { Box, Image, Text, Link } from "@chakra-ui/react";

import { IoCloudDownloadOutline } from "react-icons/io5";

const linkProps = {
  _hover: {
    cursor: "pointer",
    textDecoration: "underline",
    color: "#ff9393",
  },
  display: "flex",
  fontWeight: "500",
  alignItems: "center",
  gap: "2",
  my: 2,
};

export type TResult = {
  artistName: string;
  collectionType: string;
  collectionName: string;
  trackName?: string;
  kind?: string;
  artworkUrl100: string;
  collectionId: number;
};

export interface IResultProps {
  result: TResult;
}

const getThumb = (url: string, size: string): string => {
  if (!url) return "";
  return url.replace("100x100bb", `${size}x${size}bb`);
};

const _trimDesc = (desc: string, max: number = 100) => {
  return desc.length > max ? desc.substring(0, max) + "..." : desc;
};

const getDesc = (result: TResult) => {
  const desc =
    result.kind === "song" ? result.trackName : result.collectionName;
  if (desc) return _trimDesc(desc);
};

const Result = ({ result }: IResultProps) => {
  const hasImage = result.artworkUrl100;
  return (
    <Box
      bg='rgb(9 11 23 / 60%)'
      key={result.artworkUrl100}
      maxW='sm'
      borderWidth='1px'
      borderColor={"#e4e4e4"}
      borderRadius='lg'
    >
      {hasImage && (
        <Image
          src={getThumb(result.artworkUrl100, "270")}
          alt={result.collectionName}
          width='100%'
        />
      )}
      <Box color='#FF5E5E' p='4' pb={5}>
        <Box mb={4}>
          <Text fontWeight='semibold' fontSize='xl'>
            {result.artistName}
          </Text>
          <Text fontSize='sm' fontWeight='normal' letterSpacing='wide'>
            {getDesc(result)}
          </Text>
          {result.kind === "song" && (
            <Text as='b' fontSize='sm' fontWeight='normal' letterSpacing='wide'>
              Album: {result.collectionName}
            </Text>
          )}
        </Box>
        {hasImage ? (
          <Box fontWeight='500' alignItems={"center"} gap={2} my={2}>
            <Link
              {...linkProps}
              href={getThumb(result.artworkUrl100, "600")}
              isExternal
            >
              <IoCloudDownloadOutline />
              Standard res (600px)
            </Link>
            <Link
              {...linkProps}
              href={getThumb(result.artworkUrl100, "2000")}
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
};

export default Result;
