
export function getHashedURL(hashedURL) {
  return getHostname() + "/#/" + hashedURL;
}

function getHostname() {
	return window.location.protocol + "//" + window.location.host;
}

export function getURLForRedirect(url) {
	if (url.match(/^http?:\/\//i) || url.match(/^https?:\/\//i)) {
		return url;
	}
	return 'https://' + url;
}
