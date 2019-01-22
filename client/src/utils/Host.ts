
import { BackingStore } from "../types/";

export function getHashedURL(hashedURL: string, backingStore: BackingStore): string {
  return getHostname() + "/#" + getPrefix(backingStore) + "/" + hashedURL;
}

function getPrefix(backingStore: BackingStore): string {
  switch (backingStore) {
    case BackingStore.MAINNET:
      return "m";
    case BackingStore.ROPSTEN:
      return "r";
  }
}

export function getBackingStoreFromPrefix(hash: string): BackingStore | null {

  const firstChar = hash[1];
  console.log('first char ', firstChar);
  switch (firstChar) {
    case 'm':
      return BackingStore.MAINNET;
    case 'r':
      return BackingStore.ROPSTEN;
    default:
      return null;
  }
}

function getHostname(): string {
	return window.location.protocol + "//" + window.location.host;
}

export function getURLForRedirect(url: string): string {
	if (url.match(/^http?:\/\//i) || url.match(/^https?:\/\//i)) {
		return url;
	}
	return 'https://' + url;
}
