
export function getHashedURL(hashedURL: string): string {
  return getHostname() + "/#/" + hashedURL;
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
