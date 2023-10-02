import { getExtension, getType } from 'mime';
import type { EPub } from '..';
import { fixHTML } from './html-parse';
import { uuid } from './other';

export type CB = typeof imgSrc;

export type Image = {
  url: string,
  id: string,
  extension: string | null,
  mediaType: string | null,
};

function isDataURL(url: string) {
  return url.startsWith("data:");
}

function hasValidBase64Characters(url: string) {
  const base64Characters = /^[A-Za-z0-9+/=]+$/;
  return base64Characters.test(url);
}

export function isBase64ImageURL(url: string) {
  if (isDataURL(url)) {
    return true;
  }

  if (hasValidBase64Characters(url) && url.includes("-") && url.includes("_")) {
    try {
      const decodedData = atob(url.replace(/-/g, "+").replace(/_/g, "/"));
      // Check if the decoded data starts with a valid image signature
      if (
        decodedData.startsWith("\x89PNG") ||
        decodedData.startsWith("GIF8") ||
        decodedData.startsWith("\xFF\xD8")
      ) {
        return true;
      }
    } catch (error) {}
  }

  return false;
}
// Extract the media type from the base64 URL
function getMediaTypeFromBase64DataURL(url: string) {
  const matches = url.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
  if (matches && matches.length === 2) {
    return matches[1];
  } else {
    return null;
  }
}

function getImageExtensionFromBase64DataURL(url: string) {
  if (url.startsWith("data:")) {
    const parts = url.split(",");
    if (parts.length >= 2) {
      const metaData = parts[0].split(";");
      if (metaData.length >= 2) {
        const mediaType = metaData[0].split(":")[1];
        const mediaTypeParts = mediaType.split("/");
        if (mediaTypeParts.length >= 2) {
          return mediaTypeParts[1];
        }
      }
    }
  }
  return null;
}

function imgSrc(this: EPub, url: string) {
  let image = this.images.find(i => i.url === url);
  if (!image) {
    if (isBase64ImageURL(url)) {
      const mediaType = getMediaTypeFromBase64DataURL(url);
      image = {
        url,
        mediaType,
        id: uuid(),
        extension: getImageExtensionFromBase64DataURL(url),
      };
      this.images.push(image);
    } else {
      const mediaType = getType(url.replace(/\?.*/, "")) || "";
      image = {
        url,
        mediaType,
        id: uuid(),
        extension: getExtension(mediaType) || "",
      };
      this.images.push(image);
    }
  }
  return `images/${image.id}.${image.extension}`;
}

export function normalizeHTML(this: EPub, index: number, data: string) {
  return fixHTML.call(this, index, data, imgSrc).replace(/^<body(?: xmlns="http:\/\/www\.w3\.org\/1999\/xhtml")?>|<\/body>$/g, '');
}